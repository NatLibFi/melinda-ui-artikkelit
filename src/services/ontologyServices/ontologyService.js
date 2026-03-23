import {createAsteriNameService} from '../asteriNameService.js';
import {createFintoService} from './ontologyServiceUtils/fintoService.js';

export function createOntologyService(fintoApiUrl, sruNameApiUrl) {

  const fintoService = createFintoService(fintoApiUrl);
  const asteriNameService = createAsteriNameService(sruNameApiUrl);

  return {getOntologyData};

  async function getOntologyData(language, ontology, query) {
    if (ontology === 'finaf') { // We use FIN11 instead, as it is better
      const asteriRecords = await asteriNameService.getRecordByAuthor(query);
      const asteriResults = asteriRecords.map(r => fintofyNameData(r));
      // Convert FIN11 data to Finto-like data struct:
      return {results: asteriResults};

    }
    const result = await fintoService.queryOntologies(ontology, language, query);
    return result;

  }

  function fintofyNameData(record) {
    const [f001] = record.get('001');
    // Occasionally there's more than one 1XX:
    // 000219800 1000  L $$aPaavali$$bII,$$cpaavi,$$d1417-1471$$9fin$$0(FIN11)000219800
    // 000219800 1000  L $$aPaulus$$bII,$$cpåve,$$d1417-1471$$9swe$$0(FIN11)000219800
    // Just take the first one anyway:
    const [f1XX] = record.get(/^1..$/u); 

    //console.info(JSON.stringify(f1XX));
    //const fin11Subfields = f1XX.subfields.filter(sf => !['0'].includes(sf.code));
    //const subfield0 = {'code': '0', 'value': `(FI-ASTERI-N)${f001.value}`};
    //const subfields = [...fin11Subfields, subfield0];
    const subfields = f1XX.subfields; // NB! Potential (but unlikely) FIN11 crap will get through.

    const fintofied = {
      prefLabel: subfields.map(sf => sf.value).join(' '),
      tag: f1XX.tag,
      ind1: f1XX.ind1,
      ind2: f1XX.ind2,
      subfields: subfields,
      vocab: 'finaf',
      lang: 'fi',
      uri: `http://urn.fi/URN:NBN:fi:au:finaf:${f001.value}`
    };
    //console.info('FINTOFIED');
    //console.info(JSON.stringify(fintofied));
    return fintofied;
  }
}
