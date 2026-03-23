/*****************************************************************************/
/* ACTIONS FOR STARTING NEW ARTICLE FORM                                     */
/*****************************************************************************/

/* Local imports */
import {showFormActionsOnEdit} from '/scripts/actions/articleModes.mjs';

/* Shared imports */
import {showSnackbar} from '/shared/scripts/snackbar.js';
import {eventHandled} from '/shared/scripts/uiUtils.js';

/*****************************************************************************/


//---------------------------------------------------------------------------//
// Function for clearing all form fields
// and starting new article record from an empty form
window.startNewEmptyForm = function (event = undefined) {
  console.log('Start new record with empty form')
  eventHandled(event);

  showFormActionsOnEdit();
  showArticleFormEditMode();
  clearAllFields();
  showSnackbar({style: 'info', text: 'Aloitetaan uusi kuvailu tyhjältä pohjalta'})
}

//---------------------------------------------------------------------------//
// Function for copying the saved record
// and starting new article record with prefilled form fields
window.startNewCopyForm = function (event = undefined) {
  console.log('Start new record with copied form')
  eventHandled(event);


  showFormActionsOnEdit();
  showArticleFormEditMode();
  clearMostFields();
  showSnackbar({style: 'info', text: 'Aloitetaan uusi kuvailu emotietueen tiedot säilyttäen'})
}

