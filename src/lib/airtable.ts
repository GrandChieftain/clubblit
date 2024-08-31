import { auth, clerkClient } from '@clerk/nextjs';
import Airtable from 'airtable';

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY
});

const base = Airtable.base('apptT80fnqdIom8dX'); // Replace with your actual Base ID

export default base;

export const CLUB_MASTER_LIST = 'tbloSby2haKoleLyG';

const SEMESTERLY_GRANTS = 'tbl2wNaMJ55RiNgew';
const MONTHLY_GRANTS = 'tblTKeEZsmLbxpFnD';

export async function getFields(){
    const { orgId } = await auth();
    if (orgId){
        const organization = await clerkClient.organizations.getOrganization({organizationId: orgId});
        const airtableId = organization.privateMetadata.airtableId as string;
        if (!airtableId) return;
        const { fields } = await base(CLUB_MASTER_LIST).find(airtableId);
        return fields
    }
}

export const months = ["September", "October", "November", "February", "March", "April"] as const

export interface SemesterlyGrantParams {
    type: 'semesterly',
    period: "Fall" | "Spring"
}

export interface MonthlyGrantParams {
    type: 'monthly',
    period: typeof months[number]
}

export async function getGrant({ type, period } : SemesterlyGrantParams | MonthlyGrantParams ){
    const { orgId } = await auth();
    if (!orgId) return;
    const organization = await clerkClient.organizations.getOrganization({organizationId: orgId });
    if (type === 'semesterly'){
        const name = (organization?.publicMetadata?.name as string).replace(/'/g, "\\'"); // Escape single quotes in the name
        const grantPrefix = period === "Fall" ? '2F' : '2S';
        const fundingCycle = `${period} ${period === "Fall" ? "2023" : "2024"} Semesterly`;
        const filterByFormula = `AND({Name} = '${name}', LEFT(TRIM({Grant ID}), 2) = '${grantPrefix}', {Funding Cycle} = '${fundingCycle}')`;
        return await base(SEMESTERLY_GRANTS).select({
            filterByFormula: filterByFormula,
            maxRecords: 1
        }).firstPage().then((grants) => {
            const { fields } = grants[0];
            return (
                {
                    status: fields["Review Status"] as string,
                    officer: (fields["Assignee"] as { id: string, email: string, name: string }).name,
                    interview: fields["Require Interview?"] as "Yes" | "No" | undefined,
                    receiptLink: fields["Receipt Submission Link"] as string,
                }
            )
        }).catch(() => null)
    }
    else if (type === 'monthly'){
        const name = (organization?.publicMetadata?.name as string).replace(/'/g, "\\'"); // Escape single quotes in the name
        const grantPrefix = ["September", "October", "November"].includes(period) ? '2F' : '2S';
        const fundingCycle = `${period} Monthly`;
        const filterByFormula = `AND({Name} = '${name}', LEFT(TRIM({Grant ID}), 2) = '${grantPrefix}', {Funding Cycle} = '${fundingCycle}')`;
        return await base(MONTHLY_GRANTS).select({
            filterByFormula: filterByFormula,
            maxRecords: 1
        }).firstPage().then((grants) => {
            const { fields } = grants[0];
            return (
                {
                    status: fields["Review Status"] as string,
                    officer: (fields["Assignee"] as { id: string, email: string, name: string }).name,
                    interview: fields["Require Interview?"] as "Yes" | "No" | undefined,
                    receiptLink: fields["Receipt Submission Link"] as string,
                }
            )
        }).catch(() => null)
    }
}

export type Grant = Awaited<ReturnType<typeof getGrant>>