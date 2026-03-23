
import {parseBoolean} from '@natlibfi/melinda-commons';

  /*******************************************************************************/
  /* Helper function for handling search parameters for collection               */

  export function handleCollectionQueryParams(collectionQueryParams) {
    const artoSearchParameter = 'melinda.collection=arto';
    const fennicaSearchParameter = 'melinda.authenticationcode=finb';

    if (parseBoolean(collectionQueryParams.melinda)) {
      return '';
    }

    if (parseBoolean(collectionQueryParams.arto) && parseBoolean(collectionQueryParams.fennica)) {
      return ` AND (${artoSearchParameter} OR ${fennicaSearchParameter})`;
    }

    if (parseBoolean(collectionQueryParams.arto)) {
      return ` AND ${artoSearchParameter}`;
    }

    if (parseBoolean(collectionQueryParams.fennica)) {
      return ` AND ${fennicaSearchParameter}`;
    }

    return '';
  }

  /*******************************************************************************/
  /* Helper function for handling any other search parameters                    */

  export function handleAdditionalQueryParams(additionalQueryParams) {

    if (Object.keys(additionalQueryParams).length === 0) {
      return '';
    }

    const urlSearchParamObject = new URLSearchParams(additionalQueryParams);
    return urlSearchParamObject.toString();
  }