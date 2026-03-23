/******************************************************************************
 *
 * Record fetching and modifying for UIs
 *
 ******************************************************************************
 */


import {Router} from 'express';
import {createLogger} from '@natlibfi/melinda-backend-commons';
import {createOntologyService} from '../../services/services.js';


// https://github.com/NatLibFi/marc-record-serializers

export function createOntologyRouter(fintoApiOptions, sruApiOptions) {
  const {fintoApiUrl} = fintoApiOptions;
  const {sruNameApiUrl} = sruApiOptions;
  const logger = createLogger();
  const ontologyService = createOntologyService(fintoApiUrl, sruNameApiUrl);

  return new Router()
    .get('/:language/:ontology/:query', searchOntologyTerms)
    .use(handleError);

  function handleError(req, res, next) {
    logger.error('Error', req, res);
    next();
  }

  async function searchOntologyTerms(req, res, next) {
    try {
      logger.verbose('Sending ontology query...');
      const {language, ontology, query} = req.params;

      // NV: Should we swap finaf with FIN11 already here instead of ontologyService?

      const results = await ontologyService.getOntologyData(language, ontology, query);

      //console.info(JSON.stringify(results.results));

      postfixFintoSearchResults(results, language, ontology);

      return res.json(results);
    } catch (error) {
      console.log(error);
      return next(error);
    }

    function postfixFintoSearchResults(results, language, ontology) {
      //console.info(`LANG: ${language}, LEX: ${ontology}`);
      if (language === 'fi' && ontology === 'finmesh') {
        results.results?.forEach(r => meshToFinmesh(r));
      }
      //console.info(JSON.stringify(results));
    }

    function meshToFinmesh(r) {
      if (r.vocab !== 'mesh' || r.lang !== 'fi') {
        return;
      }
      // We want $2 finmesh instead of $2 mesh
      r.vocab = 'finmesh';
    }
  }
}

/*

{"@context":
  {
    "skos":"http://www.w3.org/2004/02/skos/core#",
    "isothes":"http://purl.org/iso25964/skos-thes#",
    "onki":"http://schema.onki.fi/onki#",
    "uri":"@id",
    "type":"@type",
    "results":{"@id":"onki:results","@container":"@list"},
    "prefLabel":"skos:prefLabel","altLabel":"skos:altLabel","hiddenLabel":"skos:hiddenLabel","@language":"fi"
  },
  "uri":"",
  "results":
    [
      {
        "uri":"http://www.yso.fi/onto/yso/p938",
        "type":["skos:Concept","http://www.yso.fi/onto/yso-meta/Concept"],
        "localname":"p938",
        "prefLabel":"kirkkokunnat",
        "lang":"fi",
        "altLabel":"kirkot (kirkkokunnat)",
        "vocab":"yso"
      },
      {
        "uri":"http://www.yso.fi/onto/yso/p25",
        "type":["skos:Concept","http://www.yso.fi/onto/yso-meta/Concept"],
        "localname":"p25","prefLabel":"kirkkorakennukset","lang":"fi","altLabel":"kirkot (rakennukset)","vocab":"yso"}]}

*/