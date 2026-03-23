import {MARCXML} from '@natlibfi/marc-record-serializers';
import {Error} from '@natlibfi/melinda-commons';
import natlibfiSruClient from '@natlibfi/sru-client';

const createNatlibfiSruClient = natlibfiSruClient


export function createSruClient(sruApiUrl) {

  const sruClientOptions = {
    url: sruApiUrl,
    recordSchema: 'marcxml',
    retrieveAll: false,
    maxRecordsPerRequest: 100
  }

  return createNatlibfiSruClient(sruClientOptions);
}


/*******************************************************************************/
/* Search and retrieve                                                         */

export function search(sruClient, query, one = false) {

  return new Promise((resolve, reject) => {
    const promises = [];

    const noValidation = {
      fields: false,
      subfields: false,
      subfieldValues: false
    };

    // console.info(`SRU query: $${searchUrl}`);

    sruClient.searchRetrieve(query)
      .on('record', xmlString => {
        promises.push(MARCXML.from(xmlString, noValidation));
      })
      .on('end', async () => {
        try {

          if (promises.length > 0) {

            if (one) {
              const [firstPromise] = promises;
              const firstRecord = await firstPromise;
              return resolve(firstRecord);
            }

            const records = await Promise.all(promises);
            return resolve(records);
          }
          reject(new Error(404, 'No records found with search and retrieve'));

        } catch (error) {
          reject(error);
        }
      })
      .on('error', error => {
        reject(error);
      });
  });
}
