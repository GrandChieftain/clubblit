import base, { CLUB_MASTER_LIST } from "@/lib/airtable";
import { FieldSet, Record } from "airtable";
import { NextResponse } from "next/server";

export async function GET(request: Request){
    try{
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') as string;
        const clubs = await base(CLUB_MASTER_LIST).select({
            filterByFormula: `SEARCH("${query.toLowerCase()}", LOWER({Name}))`,
            maxRecords: 10
        }).firstPage().then((records) => records.map((record: Record<FieldSet>) => ({ name: record.fields.Name as string, classification: record.fields["SOCO Classification"] as string })))
        return NextResponse.json({ response: clubs }, { status: 200 })
    }
    catch(error){
        console.error(error);
        return new NextResponse("Error querying database.", { status: 500 })
    }
}