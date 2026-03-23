/*******************************************************************************/
/*                                                                             */
/* BIB SERVICE: USES SRU SERVICE                                               */
/*                                                                             */
/*******************************************************************************/

import {createSruService} from '../sruServices/sruService.js'; //'./bibServiceUtils/sruService.js';
import {checkRecordType} from './bibServiceUtils/artoDataCollectorUtils.js';
import {collectData} from './bibServiceUtils/artoDataCollector.js';

export function createBibService(sruApiUrl) {

  const sruService = createSruService(sruApiUrl);

  return {getRecordById, getRecordByIsbn, getRecordByIssn, getRecordByTitle};


  async function getRecordById(id, typeParam, collectionQueryParams, additionalQueryParams) {
    const records = await sruService.getRecordById(id, collectionQueryParams, additionalQueryParams);

    return records
      .filter(record => checkRecordType(typeParam, record))
      .map(record => ({leader: record.leader, fields: record.fields, data: collectData(record)}));
  }

  async function getRecordByIsbn(isbn, typeParam, collectionQueryParams, additionalQueryParams) {
    const records = await sruService.getRecordByIsbn(isbn, collectionQueryParams, additionalQueryParams);

    return records
      .filter(record => checkRecordType(typeParam, record))
      .map(record => ({leader: record.leader, fields: record.fields, data: collectData(record)}));
  }

  async function getRecordByIssn(issn, typeParam, collectionQueryParams, additionalQueryParams) {
    const records = await sruService.getRecordByIssn(issn, collectionQueryParams, additionalQueryParams);

    return records
      .filter(record => checkRecordType(typeParam, record))
      .map(record => ({leader: record.leader, fields: record.fields, data: collectData(record)}));
  }

  async function getRecordByTitle(title, typeParam, collectionQueryParams, additionalQueryParams) {
    const records = await sruService.getRecordByTitle(title, collectionQueryParams, additionalQueryParams);

    return records
      .filter(record => checkRecordType(typeParam, record))
      .map(record => ({leader: record.leader, fields: record.fields, data: collectData(record)}));
  }

}
