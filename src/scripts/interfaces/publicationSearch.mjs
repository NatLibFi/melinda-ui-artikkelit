/*****************************************************************************/
/* FORM INTERFACE FOR SEARCHING PUBLICATION                                  */
/*****************************************************************************/


/* Local imports */
import {resetAndHideCcLicense, showCcLicense} from '/scripts/interfaces/articleBasic.mjs';
import {idbGet, idbClear, idbSet, idbGetStoredValues} from '/scripts/indexedDB.mjs';
import {getPublicationByISSN, getPublicationByISBN, getPublicationByTitle, getPublicationByMelindaId} from '/scripts/restCalls.mjs';
import {formToJson, setOptions, sortRecordData} from '/scripts/utils.mjs';

/* Shared imports */
import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';


/*****************************************************************************/


export function initPublicationSearch() {
  //console.log('initializing publication search...');

  document.getElementById('julkaisu-haku-tyyppi').addEventListener('change', showAndHideSearchInputs);
  document.getElementById('julkaisu-haku-tulos-lista').addEventListener('change', searchResultChange);

  document.getElementById('julkaisu-haku-tyyppi').dispatchEvent(new Event('change'));

  document.getElementById('julkaisu-haku-title-form').addEventListener('submit', searchPublications);
  document.getElementById('julkaisu-haku-melinda-form').addEventListener('submit', searchPublications);
  document.getElementById('julkaisu-haku-isbn-form').addEventListener('submit', searchPublications);
  document.getElementById('julkaisu-haku-issn-form').addEventListener('submit', searchPublications);

  resetPublicationSearchResultSelect();
}

function showAndHideSearchInputs(event) {
  document.getElementById(`julkaisu-haku-title-form`).style.display = 'none';
  document.getElementById(`julkaisu-haku-issn-form`).style.display = 'none';
  document.getElementById(`julkaisu-haku-isbn-form`).style.display = 'none';
  document.getElementById(`julkaisu-haku-melinda-form`).style.display = 'none';
  document.getElementById(`julkaisu-haku-${event.target.value}-form`).style.display = 'block';
}

function searchResultChange(event) {
  const sourceType = document.getElementById(`kuvailtava-kohde`).value;

  if (event.target.value !== '') {
    idbGet('artoSources', parseInt(event.target.value)).then(data => {
      console.log(data);

      document.getElementById(`lehden-nimi`).innerHTML = data.title;
      document.getElementById(`lehden-julkaisija`).innerHTML = data.publisherInfo.publisher;
      document.getElementById(`lehden-melindaId`).innerHTML = data.melindaId.replace('(FI-MELINDA)', '');

      if (sourceType === 'journal') {
        document.getElementById(`lehden-tunniste`).innerHTML = data.issns;
        document.getElementById(`lehden-vuodet`).innerHTML = data.publisherInfo.publisherYears.start + '-' + data.publisherInfo.publisherYears.end;
      }

      if (sourceType === 'book') {
        document.getElementById(`lehden-tunniste`).innerHTML = data.isbns;
        document.getElementById(`lehden-vuodet`).innerHTML = data.publisherInfo.publisherYears.start;
      }

      document.getElementById(`lehden-julkaisu-tyyppi`).innerHTML = data.recordType;

      data.isElectronic
        ? (document.getElementById(`lehden-elektroninen-julkaisu`).innerHTML = 'Kyllä', showCcLicense())
        : (document.getElementById(`lehden-elektroninen-julkaisu`).innerHTML = 'Ei', resetAndHideCcLicense());

      document.getElementById(`lehden-paikka`).innerHTML = data.publisherInfo.publisherLocation;

      document.getElementById(`lehden-julkaisumaa`).innerHTML = data.journalCountry;
      document.getElementById(`lehden-kieli`).innerHTML = data.journalLanguage;

      if (['Kausijulkaisu', 'Päivittyvä julkaisu'].includes(data.recordType) && sourceType !== 'journal') {
        showSnackbar({style: 'alert', text: 'Kuvailun kohteena on artikkeli kokoomateoksessa, mutta valitsemasi julkaisu on kausijulkaisu tai päivittyvä julkaisu'});
      }

      if (data.recordType === 'Monografia' && sourceType !== 'book') {
        showSnackbar({style: 'alert', text: 'Kuvailun kohteena on lehtiartikkeli, mutta valitsemasi julkaisu on monografia'});
      }
    });
  }
  //console.info("NV searchResultChange()");
  doUpdate()
}

export function resetPublicationSearchResultSelect(searching) {
  const select = document.getElementById('julkaisu-haku-tulos-lista');
  // No need to do anything (avoid unnecessary record refresh):
  if (!searching && select.innerHTML === '<option value="" disabled="">Ei tuloksia</option>') {
    return;
  }
  document.getElementById(`lehden-nimi`).innerHTML = '';
  document.getElementById(`lehden-melindaId`).innerHTML = '';
  document.getElementById(`lehden-tunniste`).innerHTML = '';
  document.getElementById(`lehden-julkaisija`).innerHTML = '';
  document.getElementById(`lehden-paikka`).innerHTML = '';
  document.getElementById(`lehden-julkaisu-tyyppi`).innerHTML = '';
  document.getElementById(`lehden-elektroninen-julkaisu`).innerHTML = '';
  document.getElementById(`lehden-vuodet`).innerHTML = '';
  document.getElementById(`lehden-julkaisumaa`).innerHTML = '';
  document.getElementById(`lehden-kieli`).innerHTML = '';

  if (searching) {
    return setOptions(select, [{value: '', text: 'Etsitään...'}], true);
  }

  setOptions(select, [{value: '', text: 'Ei tuloksia'}], true);
}

function searchPublications(event) {
  startProcess();

  event.preventDefault();
  idbClear('artoSources').then(() => {
    resetPublicationSearchResultSelect(true);
  });

  const hakuTyyppi = document.getElementById(`julkaisu-haku-tyyppi`).value;
  const sourceType = document.querySelector('#kuvailtava-kohde').value;
  const collectionFilter = document.getElementById('julkaisu-haku-rajaus').value;

  const collectionFilters = {
    arto: collectionFilter.includes('arto'),
    fennica: collectionFilter.includes('fennica'),
    melinda: collectionFilter.includes('melinda')
  };

  const formJson = formToJson(event);

  if (hakuTyyppi === 'title') {
    return getPublicationByTitle(formJson['haku-arvo'], collectionFilters, sourceType)
      .then(result => {
        setRecordsToSearch(result);
      })
      .catch(error => {
        resetPublicationSearchResultSelect();
        showSnackbar({style: 'alert', text: 'Valitettavasti tällä nimikkeellä ei löytynyt tietueita!'});
        console.log('Error while trying to get publication by title', error);
      })
      .finally(() => stopProcess());
  }

  if (hakuTyyppi === 'melinda') {
    return getPublicationByMelindaId(formJson['haku-arvo'], collectionFilters, sourceType)
      .then(result => {
        const goodRecords = result.filter(r => !localIsDeletedRecord(r));
        if (goodRecords.length === 0 && goodRecords.length < result.length) {
          throw new Error('Deleted record!');
        }
        setRecordsToSearch(goodRecords);
      })
      .catch(error => {
        resetPublicationSearchResultSelect();
        showSnackbar({style: 'alert', text: 'Valitettavasti tällä Melinda-ID:llä ei löytynyt tietueita!'});
        console.log('Error while trying to get publication by Melinda ID', error);
      })
      .finally(() => stopProcess());
  }

  if (hakuTyyppi === 'isbn') {
    return getPublicationByISBN(formJson['haku-arvo'], collectionFilters, sourceType)
      .then(result => {
        setRecordsToSearch(result);
      })
      .catch(error => {
        resetPublicationSearchResultSelect();
        showSnackbar({style: 'alert', text: 'Valitettavasti tällä ISBN:llä ei löytynyt tietueita!'});
        console.log('Error while trying to get publication by ISBN', error);
      })
      .finally(() => stopProcess());
  }

  if (hakuTyyppi === 'issn') {
    return getPublicationByISSN(formJson['haku-arvo'], collectionFilters, sourceType)
      .then(result => {
        setRecordsToSearch(result);
      })
      .catch(error => {
        resetPublicationSearchResultSelect();
        showSnackbar({style: 'alert', text: 'Valitettavasti tällä ISSN:llä ei löytynyt tietueita!'});
        console.log('Error while trying to get publication by ISSN', error);
      })
      .finally(() => stopProcess());
  }

  throw new Error('Invalid search type!');
}

function setRecordsToSearch(records) {
  const undeletedRecords = records.filter(r => !localIsDeletedRecord(r));

  if (undeletedRecords.length === 0) {
    return resetPublicationSearchResultSelect();
  }

  const promises = undeletedRecords.map((record, index) => {
    return idbSet('artoSources', index, record.data);
  });

  Promise.all(promises).then(() => refreshSearchResultSelect());
}

export function localIsDeletedRecord(record) {
  if (record.leader && record.leader.charAt(6) === 'd') {
    return true;
  }
  if (record.fields?.some(f => f.tag === 'STA' && f.subfields.some(sf => sf.code === 'a' && sf.value === 'DELETED'))) {
    return true;
  }
  if (record.fields?.some(f => f.tag === 'DEL')) {
    return true;
  }
  return false;
}

function refreshSearchResultSelect() {
  const select = document.getElementById('julkaisu-haku-tulos-lista');
  select.innerHTML = '';

  idbGetStoredValues('artoSources').then(sources => {
    const data = sources.map(record => {
      const {title} = record;
      const publicationType = record.isElectronic ? 'e-aineisto' : 'painettu';
      const yearsStart = record.publisherInfo.publisherYears.start;
      const yearsEnd = record.publisherInfo.publisherYears.end ?? '';
      const hyphen = ['Kausijulkaisu', 'Päivittyvä julkaisu'].includes(record.recordType) ? '-' : '';

      const text = `${title} (${publicationType}: ${yearsStart}${hyphen}${yearsEnd})`;
      return {value: record.key, text};
    });

    const searchString = (document.getElementById('julkaisu-haku-tyyppi').value === 'title')
      ? document.getElementById('julkaisu-haku-arvo-title').value.toLowerCase()
      : ''

    const sortedData = sortRecordData(searchString, data);
    return setOptions(select, sortedData);
  });
}
