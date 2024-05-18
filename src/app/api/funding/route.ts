import { MonthlyGrantParams, SemesterlyGrantParams, getGrant } from "@/lib/airtable";import { NextResponse } from "next/server";

export async function GET(request: Request){
    try{
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') as string;
        const period = searchParams.get('period') as string;
        const params = { type, period } as SemesterlyGrantParams | MonthlyGrantParams
        const grant = await getGrant(params);
        return NextResponse.json({ response: grant }, { status: 200 })
    }
    catch(error){
        console.error(error);
        return new NextResponse("Error", { status: 500 })
    }
}