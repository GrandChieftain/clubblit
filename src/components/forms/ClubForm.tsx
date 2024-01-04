// Import Airtable configuration
import base from '@/lib/airtable';
import { FieldSet, Record } from 'airtable';
import GroupForm from './GroupForm';
import { cache } from 'react';

// Example of a loader function using Airtable
export default async function ClubForm({className}: {className?: string}) {
    const getClubs = cache(async () => await base('Club Master List').select({
        // Selecting all the records in Grid view:
        view: "Grid view"
    }).all().then((records) => records.map((record: Record<FieldSet>) => ({name: record.fields.Name as string, airtableId: record.fields["Org ID"] as string}))));
    const clubs = await getClubs();
    return <GroupForm clubs={clubs} className={className} />
}