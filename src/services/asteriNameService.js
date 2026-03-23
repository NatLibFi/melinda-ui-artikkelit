/*******************************************************************************/
/*                                                                             */
/* BIB SERVICE: USES SRU SERVICE                                               */
/*                                                                             */
/*******************************************************************************/

import {createSruService} from './sruServices/sruService.js';

export function createAsteriNameService(sruApiUrl) {

  const sruService = createSruService(sruApiUrl);

  return {getRecordById, getRecordByAuthor};


  async function getRecordById(id) { // Untested. Unused. Will be used for field 100/700 creation
    const records = await sruService.getRecordById(id, false, false);

    const records2 = records.map(record => ({leader: record.leader, fields: record.fields}));
    return records2;
  }

  async function getRecordByAuthor(author) {
    const records = await sruService.getRecordByAuthor(author.replace(/\*$/u, ''));
    const records2 = records; // .map(record => ({leader: record.leader, fields: record.fields}));
    return records2;
  }

}
