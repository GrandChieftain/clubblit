import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod"; 

export async function POST(request: Request){
    const genres = ["Academic & Pre-Professional", "College Life", 
        "Creative & Performing Arts", "Cultural & Racial Initiatives", 
        "Gender & Sexuality", "Government & Politics", "Health & Wellness", 
        "Hobbies & Special Interests", "Media & Publications", 
        "Peer Counseling & Peer Education", "Public Service", 
        "Women’s Initiatives", "Religious & Spiritual"] as const

    const GroupSchema = z.object({
        id: z.string(),
        name: z.string(),
        acronym: z.string().max(20, {
            message: "Alright, that's not an acronym."
        }).or(z.literal("")),
        contactEmail: z.string().email().max(254, {
            message: 'Way too long. Try something else.'
        }),
        website: z.string().url({
            message: 'Invalid URL'
        }).max(253, {
            message: "You're going to have to shorten that URL."
        }).or(z.literal("")),
        genre: z.enum(genres)
    })

    type GroupForm = z.infer<typeof GroupSchema>;

    try{
        const formValues: GroupForm = await request.json();
        const {id, name, acronym, contactEmail, website, genre}: GroupForm = GroupSchema.parse(formValues);
        
        if (acronym.length > 0){
            const updateName = await clerkClient.organizations.updateOrganization(id, {name: acronym})
        }
        else{
            const updateName = await clerkClient.organizations.updateOrganization(id, {name: name})
        }
        
        const updateMetadata = await clerkClient.organizations.updateOrganizationMetadata(id, {
            privateMetadata:{
                status: "pending"
            },
            publicMetadata:{
                name: name,
                acronym: acronym,
                contactEmail: contactEmail,
                website: website,
                genre: genre
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
                    const deleteOrganization = await clerkClient.organizations.deleteOrganization(organizationId)
                }
                else if (officerId){
                    const updateMetadata = await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
                        privateMetadata:{
                            status: status,
                            officerId: officerId
                        }
                    })
                }
                else{
                    const updateMetadata = await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
                        privateMetadata:{
                            status: status
                        }
                    })
                }
            }
            else if (officerId){
                const updateMetadata = await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
                    privateMetadata:{
                        officerId: officerId
                    }
                })
            }
        }
        return NextResponse.json({response: validatedDict}, { status: 200 })
    }
    catch(error){
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 })
        }
        return new NextResponse("Changes failed to save.", { status: 500 })
    }   
}