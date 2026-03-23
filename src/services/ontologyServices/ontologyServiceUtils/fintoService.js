import {Error} from '@natlibfi/melinda-commons';

export function createFintoService(fintoApiUrl) {

  return {queryOntologies};

  function queryOntologies(ontology, language, query) {
    const ontology2 = ontology === 'finmesh' ? 'mesh' : ontology;
    const searchUrl = `${fintoApiUrl}?vocab=${ontology2}&lang=${language}&query=${query}`;

    console.info(`Fetch ${searchUrl}`);

    return fetch(searchUrl, {method: 'GET'})
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status, response.text());
        }
        return response.json();
      });
  }
}
