/*******************************************************************************/
/*                                                                             */
/* SRU SERVICE                                                                 */
/*                                                                             */
/*******************************************************************************/

import {createSruClient, search} from './sruClient.js'
import {handleAdditionalQueryParams, handleCollectionQueryParams} from './sruServiceUtils.js';

// NV: I think that collectionQueryParams should be moved away from here for genericity's sake.

export function createSruService(sruApiUrl) {

  const sruClient = createSruClient(sruApiUrl);

  return {getRecordById, getRecordByIsbn, getRecordByIssn, getRecordByTitle, getRecordByAuthor};

  async function getRecordById(id, collectionQueryParams = false, additionalQueryParams = false) {
    const collectionParams = handleCollectionQueryParams(collectionQueryParams);
    const additionalParams = handleAdditionalQueryParams(additionalQueryParams);

    const searchUrl = `rec.id=${id}${collectionParams}${additionalParams ? `&${additionalParams}` : ''}`;

    const records = await search(sruClient, searchUrl);
    return records;
  }

  async function getRecordByIsbn(isbn, collectionQueryParams = false, additionalQueryParams = false) {
    const collectionParams = handleCollectionQueryParams(collectionQueryParams);
    const additionalParams = handleAdditionalQueryParams(additionalQueryParams);

    const searchUrl = `bath.isbn=${isbn}${collectionParams}${additionalParams ? `&${additionalParams}` : ''}`;

    const records = await search(sruClient, searchUrl);
    return records;
  }

  async function getRecordByIssn(issn, collectionQueryParams = false, additionalQueryParams = false) {
    const collectionParams = handleCollectionQueryParams(collectionQueryParams);
    const additionalParams = handleAdditionalQueryParams(additionalQueryParams);

    const searchUrl = `bath.issn=${issn}${collectionParams}${additionalParams ? `&${additionalParams}` : ''}`;

    const records = await search(sruClient, searchUrl);
    return records;
  }

  async function getRecordByTitle(title, collectionQueryParams = false, additionalQueryParams = false) {
    const collectionParams = handleCollectionQueryParams(collectionQueryParams);
    const additionalParams = handleAdditionalQueryParams(additionalQueryParams);

    const searchUrl = `title=${title}${collectionParams}${additionalParams ? `&${additionalParams}` : ''}`;

    const records = await search(sruClient, searchUrl);
    return records;
  }

  async function getRecordByAuthor(author, additionalQueryParams = false) {
    const additionalParams = handleAdditionalQueryParams(additionalQueryParams);

    // Currently we have no index, so use this cautiously!!! Used by FIN11/Asteri
    const searchUrl = `${author}${additionalParams ? `&${additionalParams}` : ''}`;

    const records = await search(sruClient, searchUrl);

    return records;
  }


}
