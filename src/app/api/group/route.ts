import { auth, clerkClient } from "@clerk/nextjs";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod"; 
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface Creator{
    name: string,
    emailAddress: string
}

export interface Duplicate{
    members_count: number|undefined,
    creator?: Creator,
    createdAt: Date
}

export async function GET(request: Request){    
    try{
        const { searchParams } = new URL(request.url);
        const airtableId = searchParams.get('airtableId') as string;
        const duplicates = await prisma.club.findMany({
            select: { id: true, organizationId: true, createdAt: true },
            where: { airtableId: airtableId }
        });
        const data: Duplicate[] = []
        for (const { id, organizationId, createdAt } of duplicates){
            let createdBy: string | undefined = undefined;
            let members_count: number | undefined = undefined;
            try{
                const organization = (await clerkClient.organizations.getOrganizationList({query: organizationId, includeMembersCount: true}))[0];
                members_count = organization.members_count;
                if (members_count === 0){
                    await clerkClient.organizations.deleteOrganization(organizationId);
                    throw new Error("The creator must've deleted their account, so this organization was empty. Delete it from the database.")
                }
                createdBy = organization.createdBy;
            }
            catch(error){
                try{
                    await prisma.club.delete({
                        where: { id: id }
                    })
                }
                catch(error){
                    return new NextResponse("Error deleting from database.", { status: 500 })
                }
            }
            let creator: Creator | undefined = undefined;
            if (createdBy){
                try{
                    const { firstName, lastName, emailAddresses } = await clerkClient.users.getUser(createdBy);
                    creator = {
                        name: firstName + ' ' + lastName,
                        emailAddress: emailAddresses[0].emailAddress
                    }
                }
                catch{}
                data.push({
                    members_count,
                    creator,
                    createdAt
                })
            }
        }
        return NextResponse.json({ response: data }, { status: 200 })
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            return new NextResponse("Error querying database.", { status: 500 })
        }
        return new NextResponse("Error searching for duplicate organizations.", { status: 500 })
    }
}

export async function POST(request: Request){
    const GroupSchema = z.object({
        acronym: z.string().max(20, {
            message: "Alright, that's not an acronym."
        }).or(z.literal("")),
        contactEmail: z.string().email({
            message: "Invalid"
        }).max(254, {
            message: 'Way too long. Try something else.'
        }),
        website: z.string().url({
            message: 'Invalid URL'
        }).max(253, {
            message: "You're going to have to shorten that URL."
        }).or(z.literal("")),
        club: z.object({
            name: z.string(),
            airtableId: z.string().optional()
        })
    })

    type GroupForm = z.infer<typeof GroupSchema>;

    try{
        const formValues: GroupForm = await request.json();
        const {acronym, contactEmail, website, club}: GroupForm = GroupSchema.parse(formValues);
        const { orgId } = await auth();
        
        if (acronym.length > 0){
            await clerkClient.organizations.updateOrganization(orgId!, {name: acronym})
        }
        else{
            await clerkClient.organizations.updateOrganization(orgId!, {name: club.name})
        }
        
        if (club.airtableId) {
            await clerkClient.organizations.updateOrganizationMetadata(orgId!, {
                privateMetadata: {
                    airtableId: club.airtableId,
                    status: "pending"
                },
            })
            await prisma.club.create({
                data: {
                    airtableId: club.airtableId,
                    organizationId: orgId!
                }
            })
        }

        await clerkClient.organizations.updateOrganizationMetadata(orgId!, {
            publicMetadata:{
                name: club.name,
                acronym,
                contactEmail,
                website
            }
        })

        return new NextResponse("Success.", { status: 200 })
    }
    catch(error){
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 })
          }
        return new NextResponse("Form submission failed.", { status: 500 })
    }   
}

export async function PATCH(request: Request){

    const DictionarySchema = z.record(z.string(), z.array(z.string().nullable()).length(2))
    type DictionaryType = z.infer<typeof DictionarySchema>
    
    try{
        const updateDict: DictionaryType = await request.json();
        const validatedDict = DictionarySchema.parse(updateDict)

        for (const organizationId in updateDict){
            const status = updateDict[organizationId][0];
            const officerId = updateDict[organizationId][1];
            if (status){
                if (status == "deleted"){
                    await clerkClient.organizations.deleteOrganization(organizationId)
                }
                else if (officerId){
                    await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
                        privateMetadata:{
                            status,
                            officerId
                        }
                    })
                }
                else{
                    await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
                        privateMetadata:{
                            status
                        }
                    })
                }
            }
            else if (officerId){
                await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
                    privateMetadata:{
                        officerId
                    }
                })
            }
        }
        return NextResponse.json({ response: validatedDict }, { status: 200 })
    }
    catch(error){
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 })
        }
        return new NextResponse("Changes failed to save.", { status: 500 })
    }   
}

export async function DELETE(){
    try{
        const { orgId, orgRole } = await auth();
        const { adminDeleteEnabled } = await clerkClient.organizations.getOrganization({organizationId: orgId!});
        if (orgRole != "admin" || !adminDeleteEnabled){
            throw new Error("User not authorized to delete organization.")
        };
        await clerkClient.organizations.deleteOrganization(orgId!);
        return new NextResponse("Organization successfully deleted.", { status: 200 })
    }
    catch(error){
        return new NextResponse("Failed to delete organization.", { status: 500 })
    }
}