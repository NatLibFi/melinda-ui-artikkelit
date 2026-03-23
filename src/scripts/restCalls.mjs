/*****************************************************************************/
/* REST CALLS FOR ARTICLE ROUTES                                             */
/*****************************************************************************/


/* Local imports */
import {getOntologyOptions} from '/scripts/utils.mjs'

/* Shared imports */
import {doRestCall} from '/shared/scripts/common.js';

/*****************************************************************************/


//----------------------------------------------------------------------------
// CREATE THE RESTURL FOR CALLS: /REST/...

const RESTurl = `${window.location.protocol}//${window.location.host}/rest`;


//----------------------------------------------------------------------------
// CALLS FOR /REST/BIB: GET PUBLICATIONS BY MELINDA ID, TITLE, ISBN OR ISSN

export function getPublicationByMelindaId(melindaId, {arto, fennica, melinda}, type = 'journal') {
  const url = `${RESTurl}/bib/${melindaId}?arto=${arto ? 1 : 0}&fennica=${fennica ? 1 : 0}&melinda=${melinda ? 1 : 0}&type=${type}`;
  console.log(url);
  return doRestCall({url: url, method: 'GET', resultAsJson: true});
}

export function getPublicationByTitle(title, {arto, fennica, melinda}, type = 'journal') {
  const url = `${RESTurl}/bib/title/${title}?arto=${arto ? 1 : 0}&fennica=${fennica ? 1 : 0}&melinda=${melinda ? 1 : 0}&type=${type}`;
  return doRestCall({url: url, method: 'GET', resultAsJson: true});
}

export function getPublicationByISSN(issn, {arto, fennica, melinda}, type = 'journal') {
  const url = `${RESTurl}/bib/issn/${issn}?arto=${arto ? 1 : 0}&fennica=${fennica ? 1 : 0}&melinda=${melinda ? 1 : 0}&type=${type}`;
  return doRestCall({url: url, method: 'GET', resultAsJson: true});
}

export function getPublicationByISBN(isbn, {arto, fennica, melinda}, type = 'journal') {
  const url = `${RESTurl}/bib/isbn/${isbn}?arto=${arto ? 1 : 0}&fennica=${fennica ? 1 : 0}&melinda=${melinda ? 1 : 0}&type=${type}`;
  return doRestCall({url: url, method: 'GET', resultAsJson: true});
}


//----------------------------------------------------------------------------
// CALLS FOR /REST/RECORD: GENERATE, ADD AND VALIDATE ARTICLE RECORDS

export function generateArticleRecord(data) {
  const url = `${RESTurl}/record/generate/`;
  const body = JSON.stringify(data);
  return doRestCall({url: url, method: 'POST', body: body, resultAsJson: true});
}

export function addArticleRecord(data) {
  const url = `${RESTurl}/record/add/`;
  const body = JSON.stringify(data);
  return doRestCall({url: url, method: 'POST', body: body, contentType: 'application/json', resultAsJson: true});
}

export function validateArticleRecord(data) {
  const url = `${RESTurl}/record/validate/`;
  const body = JSON.stringify(data);
  return doRestCall({url: url, method: 'POST', body: body, contentType: 'application/json', resultAsJson: false});
}

//----------------------------------------------------------------------------
// CALLS FOR /REST/ONTOLOGY: GET ONTOLOGY WORDS

export function getOntologyWords(ontology, query) {
  const {searchVocab, language} = getOntologyOptions(ontology);
  const url = `${RESTurl}/ontology/${language}/${searchVocab}/${query}`;
  return doRestCall({url: url, method: 'GET', resultAsJson: true});
}
