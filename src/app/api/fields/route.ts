import { getFields } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET(){
    const fields = await getFields();
    if (!!fields) return NextResponse.json({ response: fields }, { status: 200 });
    return new NextResponse("Error fetching fields.", { status: 500 })
}