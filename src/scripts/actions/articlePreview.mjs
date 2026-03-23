/*****************************************************************************/
/* UPDATING ARTICLE VIEW                                                     */
/*****************************************************************************/


/* Local imports */
import {checkArticleForm} from '/scripts/actions/articleCheck.mjs';
import {collectRawFormData, collectStoredFormData} from '/scripts/actions/articleCollectFormData.mjs';
import {resetCheckAndSave} from '/scripts/actions/articleReset.mjs';
import {refreshAbstractList} from '/scripts/interfaces/abstracts.mjs';
import {refreshNotesList, refreshOtherRatingsList, refreshOtherTitlesList, refreshUDKsList} from '/scripts/interfaces/additionalFields.mjs';
import {refreshAuthorsList, refreshAuthorOrganizationList} from '/scripts/interfaces/authors.mjs';
import {refreshOntologyWordList} from '/scripts/interfaces/ontologyWords.mjs';
import {refreshReviewsList} from '/scripts/interfaces/reviewSearch.mjs';
import {refreshSciencesList, refreshMethodologiesList} from '/scripts/interfaces/sciencesAndMethodologies.mjs';
import {idbClear, idbSet} from '/scripts/indexedDB.mjs';
import {generateArticleRecord} from '/scripts/restCalls.mjs';


import {showRecordInDiv} from '/shared/scripts/marcRecordUi.js';
/*****************************************************************************/

// Non-updating IDs for MUU-797:
// (I inherited "allow all" and added a blacklist below. Maybe this should have been "deny all" with a whitelist instead? However, this works and was more simple to implement.)
// Also maybe this should be specified in some tag class? Might be easier to maintain?
const julkaisuIds = ['julkaisu-haku-tyyppi', 'julkaisu-haku-rajaus', 'julkaisu-haku-arvo-melinda', 'julkaisu-haku-arvo-title', 'julkaisu-haku-arvo-issn', 'julkaisu-haku-arvo-isbn'];
const tekijaIds = ['tekija-henkilo-vs-yhteiso', 'tekija-ainoa-organisaatio', 'tekija-etunimi', 'tekija-haku-arvo', 'tekija-sukunimi', 'tekija-yhteison-nimi'];
const arvosteluIds = ['arvosteltu-teos-haku-tyyppi', 'arvosteltu-teos-haku-title', 'arvosteltu-teos-haku-melinda', 'arvosteltu-teos-haku-isbn'];
const asiasanaIds = ['asiasana-ontologia', 'asiasana-haku-arvo', 'asiasana-haku-tulos-lista'];
const tiivistelmaIds = ['tiivistelma-kieli', 'tiivistelma-abstrakti'];
const lisakenttaIds = ['lisakentat-yleinen-huomautus', 'artikkelin-muu-nimeke', 'lisakentat-UDK080a', 'lisakentat-UDK080x', 'lisakentat-UDK0802', 'lisakentat-muu-luokitus-084a', 'lisakentat-muu-luokitus-0842'];
const tieteenalaIds = ['lisa-tiedot-tieteenala', 'lisa-tiedot-metodologia'];
const nonUpdatingIds = [...julkaisuIds, ...tekijaIds, ...asiasanaIds, ...arvosteluIds, ...tiivistelmaIds, ...lisakenttaIds, ...tieteenalaIds];

export function refreshAllLists() {
  const fakeEvent = undefined;
  const skipUpdate = true;
  refreshAbstractList(skipUpdate);
  refreshAuthorOrganizationList(skipUpdate);
  refreshAuthorsList(skipUpdate);
  refreshMethodologiesList(skipUpdate);
  refreshNotesList(skipUpdate);
  refreshOtherTitlesList(skipUpdate);
  refreshOntologyWordList(fakeEvent, skipUpdate);
  refreshOtherRatingsList(skipUpdate);
  refreshSciencesList(skipUpdate);
  refreshUDKsList(skipUpdate);
  refreshReviewsList(skipUpdate);
}

window.doUpdate = (event) => {
  event?.preventDefault();

  if (event) {
    // MUU-797: not all events update the marc record. Abort here!
    if (nonUpdatingIds.includes(event.target.id)) {
      //console.log(`Create record skipped despite ${event.target.id}`);
      return;
    }
    //console.log(`Create record since ${event.target.id} was triggered. Is this OK?`);
  }
  else {
    console.log('doUpdate() did not receive an event object!');
  }

  idbClear('artoRecord');

  const storedFormData = collectStoredFormData();
  const rawFormData = collectRawFormData();

  Promise.all(storedFormData)
    .then(([
      abstracts,
      authors,
      methodologies,
      notes,
      ontologyWords,
      otherRatings,
      otherTitles,
      reviews,
      sciences,
      source,
      udks
    ]) => {
      formToRecord({
        ...rawFormData,
        abstracts,
        authors,
        methodologies,
        notes,
        ontologyWords,
        otherRatings,
        otherTitles,
        reviews,
        sciences,
        source,
        udks
      })
    })
    .catch((error) => {
      console.log('Error resolving promises: ', error);
    })


  function formToRecord(articleData) {

    if (!isValid(articleData)) {
      console.log('Article data is not valid for record generation!');
      return;
    }

    //console.log(`THIS UPDATE: ${articleData.updateNumber}`);
    generateArticleRecord(articleData)
      .then(({record}) => {
        const currentUpdateNumber = parseInt(document.getElementById('update-number').innerHTML, 10);
        if (currentUpdateNumber === articleData.updateNumber) {
          setRecordToIndexedDb(record);
          updateRecordPreview(record);
          checkArticleForm();
          return;
        }
        console.log(`Warning: skip update ${articleData.updateNumber}/${currentUpdateNumber}`);
      })
      .catch((error) => {
        console.log('Error while generating article record: ', error);
      });

    function isValid(articleData) {
      //console.log('Article data is :', articleData);
      //todo: validate the data here before sending to record generation
      //or validate immediately when user adds data to form inputs
      //or validate whole form fieldsets after user has added data to one form section
      return true;
    }

    function setRecordToIndexedDb(record) {
      idbSet('artoRecord', 'record', record);
    }

    function updateRecordPreview(record) {
      const settings = {subfieldCodePrefix: '$$'};
      const previewEditorDiv = document.getElementById('previewRecordEditor');

      showRecordInDiv(record, previewEditorDiv, settings);
      resetCheckAndSave();
    }
  }

}
