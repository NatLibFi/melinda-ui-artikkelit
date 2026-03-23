/*****************************************************************************/
/* INTIALIZE ARTICLE FORM                                                    */
/*****************************************************************************/

/* Local imports */
import {} from '/scripts/actions/articleCheck.mjs';
import {} from '/scripts/actions/articleEdit.mjs';
import {fillFormOptions} from '/scripts/actions/articleFillOptions.mjs';
import {} from '/scripts/actions/articleModes.mjs';
import {} from '/scripts/actions/articleReset.mjs';
import {} from '/scripts/actions/articleSave.mjs';
import {} from '/scripts/actions/articleStartNew.mjs';
import {initAbstracts} from '/scripts/interfaces/abstracts.mjs';
import {initAdditionalFields} from '/scripts/interfaces/additionalFields.mjs';
import {initArticleBasicDetails, sourceTypeChange} from '/scripts/interfaces/articleBasic.mjs';
import {initAuthors} from '/scripts/interfaces/authors.mjs';
import {initOntologyWords} from '/scripts/interfaces/ontologyWords.mjs';
import {initPublicationSearch} from '/scripts/interfaces/publicationSearch.mjs';
import {initReviewSearch} from '/scripts/interfaces/reviewSearch.mjs';
import {initSciencesAndMethodologies} from '/scripts/interfaces/sciencesAndMethodologies.mjs';

/*****************************************************************************/


export function initArticleForm() {
  fillFormOptions();
  initSourceTypeChange();
  initInterfaces();
  addFormChangeListeners();

  const inputTag = document.getElementById('melindaIdForEdit');
  if ( inputTag ) {
    inputTag.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        fetchRecordForEditing();
      }
    });

  }
}

function addFormChangeListeners() {
  const form = document.getElementById('articleForm');

  form.addEventListener('input', doUpdate);
  form.addEventListener('textarea', doUpdate);
}

function initInterfaces() {
  initPublicationSearch(false);
  initArticleBasicDetails();
  initSciencesAndMethodologies();
  initReviewSearch();
  initAuthors();
  initAbstracts();
  initOntologyWords();
  initAdditionalFields();
}

function initSourceTypeChange() {
  document.getElementById('kuvailtava-kohde').addEventListener('change', sourceTypeChange);
  document.getElementById('kuvailtava-kohde').dispatchEvent(new Event('change'));
}
