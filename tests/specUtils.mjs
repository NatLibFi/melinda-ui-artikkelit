import {createMarcRecordService} from '../src/services/services.js';
import {dateFormatted} from '../src/services/recordServices/marcRecordServiceUtils/generateControlFields.js';

export async function genericTest(input, filter = false) {
    const fieldGeneratorService = createMarcRecordService();
    const record = await fieldGeneratorService.generateRecord(input);

    record.fields.forEach(field => setDate(field));

    // NB! If filter is not specified, returns the whole record! This is not currently (as of 2024-05-11) used, but might be useful later on...
    if (!filter) {
        return record;
    }

    return record.fields.filter(f => f.tag.match(filter));

    function setDate(field) {
        if (field.tag !== '008') {
            return;
        }
        const date = dateFormatted('now');
        field.value = `${date}${field.value.substring(6)}`;
    }
}
