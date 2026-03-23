/*****************************************************************************/
/* RESET ARTICLE FORM                                                        */
/*****************************************************************************/


/* Local imports */
import {refreshAllLists} from '/scripts/actions/articlePreview.mjs';
import {resetAndHideCcLicense} from '/scripts/interfaces/articleBasic.mjs';
import {resetPublicationSearchResultSelect} from '/scripts/interfaces/publicationSearch.mjs';
import {resetReviewSearchResultSelect} from '/scripts/interfaces/reviewSearch.mjs';
import {idbClear, getTableNames} from '/scripts/indexedDB.mjs';

/* Shared imports */
import {enableElement, disableElement} from '/shared/scripts/elements.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';

/*****************************************************************************/


export function idbClearAllTables(skipList = []) {
  for (const tableName of getTableNames()) {
    if (!skipList.includes(tableName)) {
      idbClear(tableName);
    }
  }
}

window.clearAllFields = function () {
  idbClearAllTables();
  resetPublicationSearchResultSelect();
  refreshAllLists(true);
  resetReviewSearchResultSelect();
  resetInputFields();
  resetTextareaFields();
  resetSelectFields();
  resetAndHideCcLicense();
  showSnackbar({style: 'info', text: 'Lomake tyhjennetty'});
  doUpdate();
};

window.clearMostFields = function () {
  idbClearAllTables(['artoSources']);
  //resetPublicationSearchResultSelect();
  refreshAllLists();
  resetReviewSearchResultSelect();
  resetInputFields(['numeron-vuosi', 'numeron-vol', 'numeron-numero']);
  resetTextareaFields();
  resetSelectFields(['julkaisu-haku-tulos-lista']);
  resetAndHideCcLicense();
  showSnackbar({style: 'info', text: 'Lomake alustettu'});
  doUpdate();
};

function resetInputFields(skipList = []) {
  const inputFields = document.getElementsByTagName('input');
  for (const inputField of inputFields) {
    if (!skipList.includes(inputField.id)) {
      inputField.value = '';
    }
  }
}

function resetTextareaFields() {
  for (const textarea of document.getElementsByTagName('textarea')) {
    textarea.value = '';
  }
}

function resetSelectFields(skipList = []) {
  for (const selectTag of document.getElementsByTagName('select')) {
    if (!skipList.includes(selectTag.id) && selectTag.selectedIndex !== 0) {
      selectTag.selectedIndex = 0;
      selectTag.dispatchEvent(new Event('change'));
    }
  }
}


//---------------------------------------------------------------------------//
// Function for resetting record action buttons and related form and record notes
export function resetCheckAndSave() {
  const formNotes = document.getElementById('articleFormNotes');
  const recordNotes = document.getElementById('articleRecordNotes');
  const checkArticleRecordButton = document.getElementById('actionCheckArticleRecord');
  const saveArticleRecordButton = document.getElementById('actionSaveArticleRecord');
  const forwardIcon = document.getElementById('actionForward');

  formNotes.classList.remove('record-error');
  formNotes.classList.remove('record-valid');
  formNotes.classList.remove('record-success');
  formNotes.innerHTML = '';

  recordNotes.classList.remove('record-error');
  recordNotes.classList.remove('record-valid');
  recordNotes.classList.remove('record-success');
  recordNotes.innerHTML = 'Tarkista tietue ennen tallentamista.';

  disableElement(saveArticleRecordButton);
  enableElement(checkArticleRecordButton);
  forwardIcon.classList.remove('proceed');
}

