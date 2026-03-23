/*****************************************************************************/
/* EDIT RECORD                                                               */
/*****************************************************************************/

/* Local imports */
//import {showFormActionsAfterSave, showRecordActionsAfterSave} from '/scripts/actions/articleModes.js'
import {getPublicationByMelindaId} from '/scripts/restCalls.mjs';
import {updateRecord} from '/scripts/callRest.mjs';
import {localIsDeletedRecord} from '/scripts/interfaces/publicationSearch.mjs'

/* Shared imports */
import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';

import {activateEditorButtons, deactivateEditorButtons, deactivateRemoveActiveRowButton, initEditorButtonsHandlers} from '/shared/scripts/editorButtons.js'
import {addEditorRowListerers} from '/shared/scripts/editorEvents.js';
import {displayErrors, displayNotes, isDataFieldTag, isEditableDiv, markAllFieldsUneditable} from '/shared/scripts/editorUtils.js';
import {convertFieldsToRecord, extractErrors, getEditorFields, showRecordInDiv} from '/shared/scripts/marcRecordUi.js';


const subfieldCodePrefix = '$$'; // '$$',
const artikkeliEditorSettings = {
  editorDivId: 'editorFields', // ID of the html tag within which the fields are stored
  editableField: isEditableField,
  editableRecord: isEditableRecord,
  newFieldValue: `TAG##${subfieldCodePrefix}aLorum Ipsum.`,
  subfieldCodePrefix,
  uneditableFieldBackgroundColor: 'gainsboro',
};


//import { fieldToString } from '@natlibfi/marc-record-validators-melinda/dist/utils';

window.activeFieldElement = undefined; // Global variable for determining the row/field that last had focus. DO this is app, breaks tests...

initEditorButtonsHandlers(artikkeliEditorSettings);

// When i.e. a button (eg. "add row") is clicked, the active field div loses focus.
// Here we store the prev active field element, so that we know where prev/next field should be added
// and that can we delete row.
document.addEventListener('focusout', function(event) {
  window.activeFieldElement = getEditableFieldElement(event.target); // Store the last active field element
});

document.addEventListener('focusin', function(event) {
  //console.log('focusin 1/3');
  const prevActiveElement = window.activeFieldElement;
  const elem = getEditableFieldElement(event.target);
  if (elem) {
    //console.log('focusin 2/3');
    window.activeFieldElement = elem;
    if (!prevActiveElement) {
      //console.log('focusin 3/3');
      ['addNewRowAbove', 'addNewRowBelow', 'removeActiveRow'].forEach(enableElementById);
    }
    return;
  }
  if (!prevActiveElement) {
    return;
  }
  const elemId = event && event.target ? event.target.id : 'NO ID';
  // console.log(`focusin, elem id '${elemId}'`);
  // Sanity check. Otherwise active row removal won't work, as removeActiveRow.click would be turned off by deactivateRemoveActiveRowButton().
  if (elemId && [/*'addNewRowAbove', 'addNewRowBelow',*/ 'removeActiveRow'].includes(elemId)) {
    return;
  }
  deactivateRemoveActiveRowButton(); // other buttons will turn this off here and on elsewhere
});

function getEditableFieldElement(elem) {
  if (!elem) {
    return undefined;
  }
  if (elem.classList.contains('row') && isEditableDiv(elem)) {
    return elem;
  }

  return getEditableFieldElement(elem.parentElement);
}


/*****************************************************************************/


window.fetchRecordForEditing = function (melindaId = undefined) {
  //eventHandled(event);

  if (!melindaId) { // If not Id is provided, use a global variable
    const inputTag = document.getElementById('melindaIdForEdit');
    melindaId = inputTag.value;
  }
  // TODO: Validate value
  console.log(`Fetch (FI-MELINDA)${melindaId} for editing`);

  getPublicationByMelindaId(melindaId, {}, false)
  .then((records) => {
    const [record] = records;
    const editableRecord = isEditableRecord(record);



    const divForFields = document.getElementById(artikkeliEditorSettings.editorDivId); // This id should be changed,

    showRecordInDiv(record, divForFields, artikkeliEditorSettings);
    displayNotes([]);



    const fieldDivs = [...divForFields.children]; // converts children into an editable array
    if (fieldDivs.length === record.fields.length + 1) { // Is this sanity check really needed
      //console.log("Set inner contentEditables")
      fieldDivs.forEach(f => fieldHandleListeners(f, artikkeliEditorSettings));
    }

    // console.log("LOADED");

    const recordDiv = document.getElementById('recordEditor');
    if (recordDiv) {
      recordDiv.style.display = 'block';
    }

    const commentForEdit = document.getElementById('commentForEdit');
    if (!editableRecord) {
      showSnackbar({status: 'info', text: record.error});
      console.log(`Won't edit! Reason: ${record.error}`);
      commentForEdit.innerHTML = `Tietuetta ei voi editoida. Syy: ${record.error}`;
      setButtonRowDisplay('none');
      return;
    }

    commentForEdit.innerHTML = '';
    activateEditorButtons();
    deactivateRemoveActiveRowButton();
    setButtonRowDisplay('flex');
    return;
  });

  function fieldHandleListeners(fieldElem) {
    if (!isEditableDiv(fieldElem)) { // No listeners needed
      return;
    }

    addEditorRowListerers(fieldElem, artikkeliEditorSettings);
  }
};


//---------------------------------------------------------------------------//
// called by melinda-ui-commons button
window.cancelEdit = function (event = undefined) {
  // I think this is enough: the record is still there, but can't be accessed without changing the record
  const recordDiv = document.getElementById('recordEditor');
  if (recordDiv) {
    recordDiv.style.display = 'none';
  }
};

//---------------------------------------------------------------------------//
// "Tarkista tietue palvelimella ja tallenna se" button in melinda-ui-commons' editor buttons
window.saveEditorRecord = function (event = undefined) {
  console.log('Saving updated article record...');
  eventHandled(event); // prevents editor window from closing!

  // 1. Show errors Convert edit data to a record
  const validationErrors = extractErrors(artikkeliEditorSettings);

  if (validationErrors.length > 0) {
    const mainErrorMessage = 'Tietueessa on virheitä, joten sitä ei pysty vielä tallentamaan';
    displayErrors([mainErrorMessage, ...validationErrors]);
    showSnackbar({style: 'alert', text: mainErrorMessage});
    console.log(mainErrorMessage);
    return;
  }
  displayNotes([]); // empty editor notes

  // 2. Convert fields to a proper marc JSON record
  const fieldsInEditor = getEditorFields(artikkeliEditorSettings.editorDivId, artikkeliEditorSettings.subfieldCodePrefix);
  const record = convertFieldsToRecord(fieldsInEditor, artikkeliEditorSettings);
  // console.log(JSON.stringify(record));
  // 3. Update record or die trying and complaining about it
  startProcess(); // progress bar on
  deactivateEditorButtons();
  markAllFieldsUneditable(artikkeliEditorSettings);
  //showSnackbar({style: 'success', text: 'Tietueen voinee päivittää...'});

  updateRecordToMelinda(record);
};



//---------------------------------------------------------------------------//
// "Validate record" button in editor's button row (local validation)
window.validateEditorRecord = function (event = undefined) {
  console.log('Validate editor record...');

  eventHandled(event); // prevents editor window from closing! (has this comment become obsolete?)

  // 1. Show errors Convert edit data to a record
  const validationErrors = extractErrors(artikkeliEditorSettings);

  if (validationErrors.length > 0) {
    const mainErrorMessage = 'Tietueessa on virheitä!';
    displayErrors([mainErrorMessage, ...validationErrors]);
    showSnackbar({style: 'alert', text: mainErrorMessage});
    console.log(mainErrorMessage);
    return;
  }
  displayNotes(['Tietueesta ei löytynyt virheitä']);
}


//---------------------------------------------------------------------------//
// Function for updating record data
//    - send record to rest api for update
//    - check response status
//        * if status is 201 (or 200), update ok (TODO: this is a modified copypaste from add, so return values need to be checked)
//            => call function recordUpdateSuccess and pass the result as parameter
//        * other statuses, handle as error

function updateRecordToMelinda(data) { // NB! Artikkelit is update-only...
  const f001 = data.fields.find(f => f.tag === '001');
  const melindaId = f001.value;
  //console.log(`articleEdit.js updateRecordToMelinda(record ${melindaId}) in...`);

  updateRecord(melindaId, data)
    .then((result) => {
      //console.info(JSON.stringify(result));

      if (result.recordStatus === 'UPDATED') {
        recordUpdateSuccess(result, melindaId);
        return result;
      }

      recordUpdateFailed(result);
      throw new Error(`Updating record responded with not ok status ${result.message}`);

    })
    .catch((error) => {
      console.log('Article record update failed, error: ', error);
    })
    .finally(() => {
      stopProcess();
    });


  function recordUpdateSuccess(result) {
    console.log('Article (or host) record updated with message: ', result.message);

    const text= `Tietueen päivitys onnistui: ${result.databaseId}`;
    displayNotes(text);
    //showRecordActionsAfterSave(); // should check what this is/does
    //showFormActionsAfterSave(result.databaseId, result.testServer); // should check what this is/does
    showSnackbar({style: 'success', text});

    // MUU-834 referesh record (= reload it from Aleph)
    fetchRecordForEditing(melindaId);
  }


  function recordUpdateFailed(result) {
    console.log('Article (or host) record was not updated, statustext: ', result.message);

    displayErrors(`Päivittäminen epäonnistui<br>${result.message}`);

    showSnackbar({style: 'alert', text: 'Valitettavasti tietuetta ei pystytty päivittämään'});
  }
}




// artikkelit-specific function which is passed to melinda-ui-commons in a config parameter
function isEditableField(field, recordIsEditable = true) {
  // NB! These rules are APP specific. This set of rules is for Artikkelit.
  // NB! Should we have superusers that can edit everything?
  // Should we just gather various errors here?
  //console.log(`EDITABLE FIELD? ${JSON.stringify(field)}`);
  if ( !recordIsEditable) {
    return false;
  }
  if (!field.subfields || field.subfields.length === 0) {
    // A crappy subfieldless datafield is editable. Control fields are not editable in this app.
    return isDataFieldTag(field.tag);
  }
  // Contains owenership information that should not be edited here:
  const subfield5 = field.subfields.find(sf => sf.code === '5');
  if (subfield5) {
    return subfield5.value === 'ARTO'; // On $5 ARTO can be edited
  }

  if (field.subfields.some(sf => sf.code === '9' && sf.value.match(/^[A-Z]+<KEEP>$/u))) {
    return false;
  }

  // Various fields Artikkelit app should not edit.
  if (field.tag.match(/^[A-Z][A-Z][A-Z]/u)) {
    // Actually we should list Aleph tags that the user can't edit...
    // ['DEL', 'LKR', 'LDR' 'STA']
    if (['TAG', 'HLI'].includes(field.tag)) {
      return true;
    }
    return false;
  }

  // As this editor is used by inexperienced catalogers, I'm not lettings them touch everything...
  if (['015', '035', '042', '336', '337', '338', '960'].includes(field.tag)) {
    return false;
  }
  return isDataFieldTag(field.tag);
}

// artikkelit-specific function which is passed to melinda-ui-commons in a config parameter
function isEditableRecord(record) {
  console.log("IS EDITABLE RECORD?");
  if (!record.fields) {
    record.error = 'Tietueessa ei ole kenttiä.';
    return false;
  }

  const f960 = record.fields.find(f => f.tag === '960' && f.subfields?.some(sf => sf.code === 'a' && sf.value === 'ARTO'));
  if (!f960) {
    record.error = 'Tietue ei kuulu ARTO-kokoelmaan';
    return false;
  }

  if (localIsDeletedRecord(record)) {
    record.error = 'Tietue on poistettu';
    return false;
  }
  // Must belong to Arto
  return true;
}

function setButtonRowDisplay(value) {
  const buttonRowElem = document.getElementById('editorButtons');
  if (buttonRowElem) {
    buttonRowElem.style.display = value;
  }
}

