/*****************************************************************************/
/* COLLECT DATA FROM FORM                                                    */
/*****************************************************************************/


/* Local imports */
import {idbClear, idbGet, idbGetStoredValues} from '/scripts/indexedDB.mjs';

/*****************************************************************************/

function getUpdateNumber() {
  let elem = document.getElementById('update-number');
  const n = parseInt(elem.innerHTML, 10) + 1;
  elem.innerHTML = n;
  return n;
}

export function collectRawFormData() {
  const [iso6391, iso6392b, ui] = document.getElementById('artikkelin-kieli').value.split(';');

  const links = [];
  document.getElementsByName('artikkelin-linkki').forEach(el => links.push(el.value));


  return {
    journalNumber: { // Rename to journalData
      publishingYear: document.getElementById('numeron-vuosi').value,
      volume: document.getElementById('numeron-vol').value,
      number: document.getElementById('numeron-numero').value,
      pages: document.getElementById('numeron-sivut').value,
      journalCountry: document.getElementById('lehden-julkaisumaa').value,
      journalLanguage: document.getElementById('lehden-kieli').value
    },
    article: {
      title: document.getElementById('artikkelin-otsikko').value,
      subtitle: document.getElementById('artikkelin-alaotsikko').value,
      statementOfResponsibility: document.getElementById('artikkelin-vastuullisuusmerkinnot').value,
      titleOther: document.getElementById('artikkelin-muu-nimeke').value,
      language: {iso6391, iso6392b, ui},
      link: links,
      type: document.getElementById('artikkelin-tyyppi').value,
      sectionOrColumn: document.getElementById('artikkelin-osasto-toistuva').value,
      ccLicense: document.getElementById('artikkelin-cc-lisenssi').value
    },
    collecting: {
      f598a: document.getElementById('poimintatiedot-poimintakoodi598a').value,
      f599a: document.getElementById('poimintatiedot-poimintakoodi599a').value,
      f599x: document.getElementById('poimintatiedot-poimintakoodi599x').value
    },
    updateNumber: getUpdateNumber()
  };

}



export function collectStoredFormData() {

  return [
    idbGetStoredValues('artoAbstracts'),
    idbGetStoredValues('artoAuthors'),
    idbGetStoredValues('artoMetodologys'),
    idbGetStoredValues('artoNotes'),
    idbGetStoredValues('artoOntologyWords'),
    idbGetStoredValues('artoOtherRatings'),
    idbGetStoredValues('artoOtherTitles'),
    getReviews(),
    idbGetStoredValues('artoSciences'),
    getHostRecordData(),
    idbGetStoredValues('artoUDKs'),
  ];


  function getReviews() {
    // collectReviewsCheck();

    return idbGetStoredValues('artoReviews');

    /*
    function collectReviewsCheck() {
      const articleType = document.getElementById('artikkelin-tyyppi').value;
      const excludeReviews = ['A1', 'A2', 'A3'].some(str => articleType.includes(str));

      if (excludeReviews) {
        idbClear('artoReviews');
      }

    }
    */

  }


  function getHostRecordData() {
    const tietueIndex = document.getElementById('julkaisu-haku-tulos-lista').value;

    if (tietueIndex !== '') {
      return idbGet('artoSources', parseInt(tietueIndex));
    }

    return undefined;
  }

}

