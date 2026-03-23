/*****************************************************************************/
/* SAVE RECORD                                                               */
/*****************************************************************************/

/* Local imports */
import {showFormActionsAfterSave, showRecordActionsAfterSave} from '/scripts/actions/articleModes.mjs'
import {idbGet} from '/scripts/indexedDB.mjs';
import {addArticleRecord, getPublicationByMelindaId} from '/scripts/restCalls.mjs';
import {updateRecord} from '/scripts/callRest.mjs';

/* Shared imports */
import {startProcess, stopProcess} from '/shared/scripts/progressbar.js';
import {showSnackbar} from '/shared/scripts/snackbar.js';

/*****************************************************************************/



//---------------------------------------------------------------------------//
// Activated by "Tallenna" button. ex-Confirm action in dialog window. Should be renamed eventually.
window.saveRecord = function (event = undefined) {
  console.log('Saving article record...');

  startProcess();

  idbGet('artoRecord', 'record') // get the article from indexeddb
    .then((data) => {
      addHostToArto(data); // add 960 ## $a ARTO
      addRecord(data);
    })
    .catch((error) => {
      console.log('Error getting record from indexedDB (if undefined, probably it is not yet set): ', error);
      showSnackbar({style: 'alert', text: 'Valitettavasti tietueen käsittelyssä tapahtui virhe'});
      stopProcess();
    })
}

async function addHostToArto(data) {
  const field773 = data.fields.find(f => f.tag === '773');

  const w = field773.subfields.find(sf => sf.code === 'w' && sf.value.match(/^\((?:FI-MELINDA|FIN01)\)0[0-9]{8}$/u));
  if (!w) {
    return;
  }
  const hostId = w.value.slice(-9);

  const args = {'arto': true, 'fennica': true, 'melinda': true};

  // addArticleRecord(data) HUH?
  getPublicationByMelindaId(hostId, args, false)
  .then((records) => {
    const hostRecord = records[0];
    console.info(`HOST ID: ${hostId}`);

    const fields960 = hostRecord.fields.filter(f => f.tag === '960');
    if (fields960.some(f => f.subfields.some(sf => sf.code === 'a' && sf.value === 'ARTO'))) {
      return;
    }

    //alert(`HOST: ADD 960 $a ARTO to ${hostId}`);
    const newField960 = {'tag': '960', 'ind1': ' ', 'ind2': ' ', 'subfields': [ {'code': 'a', 'value': 'ARTO'}]};
    hostRecord.fields = [...hostRecord.fields, newField960];
    //alert(`TODO: add ${JSON.stringify(newField960)}`);

    updateRecord(hostId, hostRecord)
    .then((response) => {
      console.info(response);
      showSnackbar({style: 'success', text: `Emotietueeseen ${hostId} lisätty 960 ## $a ARTO`});
      //showSnackbar({style: 'success', text: 'Emoon lisätty 960 ## $a ARTO'});
    })
    .catch((error) => {
      //console.log(`Article record add failed, error: ${error}`);
      console.log(`Article record add failed, error`);
    });
  })
  .catch((error) => console.log('Article record add failed, error: ', error));

}

//---------------------------------------------------------------------------//
// Function for creating record data
//    - send record to rest api for addition
//    - check response status
//        * if status is 201 (or 200), creation ok
//            => call function recordAdditionSuccess and pass the result as parameter
//        * other statuses, handle as error
function addRecord(data) {
  console.info('articleSave.js addRecord() in...');
  addArticleRecord(data)
    .then((result) => {
      console.info(JSON.stringify(result));

      if (result.recordStatus === 'CREATED') {
        recordAdditionSuccess(result);
        return result;
      }

      recordAdditionFailed(result);
      throw new Error(`Adding record responded with not ok status ${result.message}`);

    })
    .catch((error) => {
      console.log('Article record save failed, error: ', error);
    })
    .finally(() => {
      stopProcess();
    });


  function recordAdditionSuccess(result) {
    console.log('Article record saved with message: ', result.message);

    if (result.message.includes('Created record')) {
      showRecordActionsAfterSave(result.databaseId);
      showArticleFormReadMode();
      showFormActionsAfterSave(result.databaseId, result.testServer);
    }
    showSnackbar({style: 'success', text: `Tietueen tallennus onnistui: ${result.databaseId}`});
  }


  function recordAdditionFailed(result) {
    console.log('Article record was not saved, statustext: ', result.message);

    const recordNotes = document.getElementById('articleRecordNotes');

    recordNotes.innerHTML = `Tallentaminen epäonnistui<br>${result.message}`;
    recordNotes.classList.add('record-error');
    highlightElement(recordNotes);
    showSnackbar({style: 'alert', text: 'Valitettavasti artikkelia ei pystytty tallentamaan'});
  }
}

