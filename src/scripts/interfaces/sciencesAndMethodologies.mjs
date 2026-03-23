/*****************************************************************************/
/* FORM INTERFACE FOR SCIENCES AND METHODOLOGIES                             */
/*****************************************************************************/


/* Local imports */
import {idbAddValueToLastIndex, idbClear, idbDel, idbGetStoredValues, } from '/scripts/indexedDB.mjs';
import {createIconButton, createP, formToJson} from '/scripts/utils.mjs';

/* Shared imports */
import {showSnackbar} from '/shared/scripts/snackbar.js';

/*****************************************************************************/


export function initSciencesAndMethodologies() {
  //console.log('initializing sciences and methodologies...');

  document.getElementById('lisa-tiedot-lisaa-tieteenala').addEventListener('submit', addScience);
  document.getElementById('lisa-tiedot-lisaa-metodologia').addEventListener('submit', addMethodology);

  document.getElementById('tyhjenna-tieteenalat-form').addEventListener('submit', clearSciences);
  document.getElementById('tyhjenna-metodologiat-form').addEventListener('submit', clearMethodologies);

  refreshSciencesList(false); // don't do doUpdate() as refreshMethodologiesList() will do it
  refreshMethodologiesList();
}

export function refreshMethodologiesList(skipUpdate = false) {
  const methodologyList = document.getElementById('metodologiat-list');
  methodologyList.innerHTML = '';

  idbGetStoredValues('artoMetodologys').then(methodologies => {
    methodologies.forEach(methodologyData => {
      const form = document.createElement('form');
      const div = document.createElement('div');
      div.classList.add('full-width');
      const removeButton = createIconButton('delete_outline', ['alternate-red', 'small'], `return removeMethodology(event, ${methodologyData.key})`, 'Poista');
      div.appendChild(createP('Metodologia', '', '&nbsp;-&nbsp;', ['label-text']));
      div.appendChild(createP(methodologyData.value));
      div.appendChild(removeButton);
      form.appendChild(div);
      methodologyList.appendChild(form);
    });

    if (methodologies.length > 1) {
      document.getElementById('tyhjenna-metodologiat-form').style.display = 'block';
    }

    if (methodologies.length < 2) {
      document.getElementById('tyhjenna-metodologiat-form').style.display = 'none';
    }
  });

  if (!skipUpdate) {
    //console.info("NV refreshMethodologiesList()");
    doUpdate();
  }
}

export function refreshSciencesList(skipUpdate = false) {
  const scienceList = document.getElementById('tieteenalat-list');
  scienceList.innerHTML = '';

  idbGetStoredValues('artoSciences').then(sciences => {
    sciences.forEach(scienceData => {
      const form = document.createElement('form');
      const div = document.createElement('div');
      div.classList.add('full-width');
      const removeButton = createIconButton('delete_outline', ['alternate-red', 'small'], `return removeScience(event, ${scienceData.key})`, 'Poista');
      div.appendChild(createP('Tieteenala', '', '&nbsp;-&nbsp;', ['label-text']));
      div.appendChild(createP(scienceData.departmentName));
      div.appendChild(createP(scienceData.subject, '&nbsp;-&nbsp;'));
      form.appendChild(div);
      div.appendChild(removeButton);
      scienceList.appendChild(form);
    });

    if (sciences.length > 1) {
      document.getElementById('tyhjenna-tieteenalat-form').style.display = 'block';
    }

    if (sciences.length < 2) {
      document.getElementById('tyhjenna-tieteenalat-form').style.display = 'none';
    }
  });

  if (!skipUpdate) {
    //console.info("NV refreshSciencesList()");
    doUpdate();
  }
}

window.removeMethodology = (event, key) => {
  event.preventDefault();
  idbDel('artoMetodologys', key).then(() => refreshMethodologiesList());
};

window.removeScience = (event, key) => {
  event.preventDefault();
  idbDel('artoSciences', key).then(() => refreshSciencesList());
};

function addMethodology(event) {
  event.preventDefault();
  const formJson = formToJson(event);
  console.log('methodology');
  const methodology = formJson['lisa-tiedot-metodologia'];

  if (methodology === '') {
    showSnackbar({style: 'alert', text: 'Metodologia ei voi olla tyhjä'});
    return;
  }

  idbGetStoredValues('artoMetodologys').then(methodologies => {
    if (methodologies.some(met => met.value === methodology)) {
      showSnackbar({style: 'alert', text: 'Artikkelille on jo lisätty tämä metodologia'});
      return;
    }

    idbAddValueToLastIndex('artoMetodologys', {value: methodology}).then(() => {
      document.getElementById('lisa-tiedot-metodologia').value = '';
      refreshMethodologiesList();
    });
  });
}

function addScience(event) {
  event.preventDefault();
  const formJson = formToJson(event);
  console.log('science');
  //const science = formJson['lisa-tiedot-tieteenala']; // old
  const elem = document.getElementById('lisatiedot-tieteenala-lista');
  const science = elem.value;

  if (!science || science === '') {
    showSnackbar({style: 'alert', text: 'Valitse ensin tieteenala'});
    return;
  }

  const [department, departmentName, subCategory, subject] = science.split(' - ');

  idbGetStoredValues('artoSciences').then(sciences => {
    if (sciences.some(sci => sci.subject === subject || sci.subCategory === subCategory)) {
      showSnackbar({style: 'alert', text: 'Artikkelille on jo lisätty tämä tieteenala'});
      return;
    }

    idbAddValueToLastIndex('artoSciences', {department, departmentName, subCategory, subject}).then(() => {
      //document.getElementById('lisa-tiedot-tieteenala').value = '';
      elem.selectedIndex = 0;
      refreshSciencesList();
    });
  });
}

function clearMethodologies(event) {
  event.preventDefault();
  idbClear('artoMetodologys').then(() => refreshMethodologiesList());
}

function clearSciences(event) {
  event.preventDefault();
  idbClear('artoSciences').then(() => refreshSciencesList());
}
