import {createLogger} from '@natlibfi/melinda-backend-commons';
import {createMelindaApiRecordClient} from '@natlibfi/melinda-rest-api-client';

export function createMelindaApiService(melindaApiOptions) {
  const logger = createLogger();
  const restApiRecordClient = createMelindaApiRecordClient(melindaApiOptions);

  return {addRecord, updateRecord, validateRecord};

  async function addRecord(record, cataloger) { // Cyrillux has createRecord()
    logger.info('RECORD SERVICE: addRecord');
    let result = await restApiRecordClient.create(record, {noop: 0, cataloger: cataloger});
    result.testServer = melindaApiOptions.melindaApiUrl.includes('melinda-test.kansalliskirjasto.fi') ? true : false; // used when creating link to the created record
    return result; // NV: this is returned to recordRouter.js' addRecord()...
  }

  async function updateRecord(id, record, cataloger) {
    logger.info('MELINDA API SERVICE: updateRecord');
    const result = await restApiRecordClient.update(record, id, {noop: 0, cataloger: cataloger});
    return result;
  }

  async function validateRecord(record) { // For new article creation. See Cyrillux about old article validation
    logger.info('RECORD SERVICE: validateRecord');
    const result = await restApiRecordClient.create(record, {noop: 1});
    return result;
  }

}
