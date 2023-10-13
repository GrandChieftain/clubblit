import xlsx from 'json-as-xlsx'
import { IJsonSheet } from 'json-as-xlsx'

export function downloadToExcel(){
    let columns: IJsonSheet[] = [
        {
            sheet: "Persons",
            columns: [
                {label: "Person ID", value: 'id'},
                {label: "First Name", value: 'first_name'}
            ],
            content: [] //data
        }
    ];

    let settings = {
        fileName: "Excel Title",

    }

    xlsx(columns, settings)

}