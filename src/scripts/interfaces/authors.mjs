/*****************************************************************************/
/* FORM INTERFACE FOR AUTHORS                                                */
/*****************************************************************************/

/* Local imports */
import {checkArticleForm} from '/scripts/actions/articleCheck.mjs';
import {idbAddValueToLastIndex, idbClear, idbDel, idbGetStoredValues} from '/scripts/indexedDB.mjs';
import {createIconButton, createP, formToJson, setOptions} from '/scripts/utils.mjs';
import {addValueToSessionStoreList, getSessionStoreValue, resetSessionStoreList} from '/scripts/sessionStorage.mjs';
import {getOntologyWords} from '/scripts/restCalls.mjs'; // Get Asteri data

/* Shared imports */
import {showSnackbar} from '/shared/scripts/snackbar.js';

/*****************************************************************************/



export function initAuthors() {
  //console.log('initializing authors...');

  document.getElementById('tekija-lisaa-form').addEventListener('submit', addAuthor);
  //document.getElementById('tekija-lisaa-organisaatio-form').addEventListener('submit', addOrganizationForAuthor);
  document.getElementById('tyhjenna-tekijat-form').addEventListener('submit', clearAuthors);

  //document.getElementById('tekija-haku-form').addEventListener('submit', searchAuthors);
  document.getElementById('input-tekija-hae').addEventListener('click', searchAuthors);

  refreshAuthorsList(false); // doUpdate() will be done by refreshAutjorOrganizationList() below
  refreshAuthorOrganizationList();
  resetAuthorSelect();
}

export function refreshAuthorsList(skipUpdate = false) {
  const authorList = document.getElementById('tekija-list');
  authorList.innerHTML = '';

  idbGetStoredValues('artoAuthors').then(authors => {
    authors.forEach(authorData => {
      const form = document.createElement('form');
      const div = document.createElement('div');
      div.classList.add('full-width');
      const removeButton = createIconButton('delete_outline', ['alternate-red', 'small'], `return removeAuthor(event, ${authorData.key})`, 'Poista');
      div.appendChild(createP('Tekijä', '', '&nbsp;-&nbsp;', ['label-text']));

      if (authorData.type === 'henkilö') {
        div.appendChild(createP(authorData.lastName));

        if (authorData.firstName !== '') {
          div.appendChild(createP(authorData.firstName, ',&nbsp;'));
        }
      }

      if (authorData.type === 'yhteisö') {
        div.appendChild(createP(authorData.corporateName));
      }

      if (authorData.type === 'FIN11') {
        const asteriData = authorData.asteriAuthor;
        const tmp = asteriData.subfields.map(sf =>sf.value).join(' ');
        const subfield0 = asteriData.subfields.find(sf => sf.code === '0');
        const asteriId =  subfield0.value.slice(-9);
        console.log(tmp);
        div.appendChild(createP(`<a href="https://finto.fi/finaf/fi/page/${asteriId}" target="_blank">${tmp}</a>`, '&nbsp;-&nbsp;'));
      }

      if (authorData.authorsOrganization) {
        div.appendChild(createP(authorData.authorsOrganization, '&nbsp;-&nbsp;'))
      }

      if (authorData.relator !== '') {
        const pRelator = createP(authorData.relator, '&nbsp;-&nbsp;');
        pRelator.classList.add('capitalize');
        div.appendChild(pRelator);
      }
      /*
      authorData.authorsTempOrganizations.forEach(organization => {
        div.appendChild(createP(organization.organizationName, '&nbsp;-&nbsp;'));
        if (organization.code) {
          div.appendChild(createP(organization.code, '&nbsp;/&nbsp;'));
        }

        if (organization.organizationShortTerm && !organization.code) {
          div.appendChild(createP(organization.organizationShortTerm, '&nbsp;/&nbsp;'));
        }

        if (organization.note) {
          div.appendChild(createP(organization.note, '&nbsp;(', ')'));
        }
      });
      */

      div.appendChild(removeButton);
      form.appendChild(div);
      authorList.appendChild(form);
    });

    if (authors.length > 1) {
      document.getElementById('tyhjenna-tekijat-form').style.display = 'block';
    }

    if (authors.length < 2) {
      document.getElementById('tyhjenna-tekijat-form').style.display = 'none';
    }
  });

  if (!skipUpdate) {
    //console.info("NV refreshAuthorsList()");
    doUpdate();
  }
}

export function refreshAuthorOrganizationList(skipUpdate = false) {
  const organizationList = document.getElementById('tekija-organisaatiot-list');
  organizationList.innerHTML = '';

  idbGetStoredValues('artoAuthorTempOrg').then(tempOrgs => {
    tempOrgs.forEach(tempOrgData => {
      const form = document.createElement('form');
      const div = document.createElement('div');
      div.classList.add('full-width');
      const removeButton = createIconButton('delete_outline', ['alternate-red', 'small'], `return removeOrgForAuthor(event, ${tempOrgData.key})`, 'Poista');
      div.appendChild(createP('Organisaatio', '', '&nbsp;-&nbsp;', ['label-text']));
      div.appendChild(createP(tempOrgData.organizationName));

      /*
      if (tempOrgData.organizationShortTerm) {
        div.appendChild(createP(tempOrgData.organizationShortTerm, '&nbsp;/&nbsp;'));
      }
      */

      if (tempOrgData.code) {
        div.appendChild(createP(tempOrgData.code, '&nbsp;/&nbsp;'));
      }

      if (tempOrgData.note) {
        div.appendChild(createP(tempOrgData.note, '&nbsp;(', ')'));
      }
      div.appendChild(removeButton);
      form.appendChild(div);
      organizationList.appendChild(form);
    });
  });

  if (!skipUpdate) {
    //console.info("NV refreshAuthorOrganizationsList()");
    doUpdate();
  }
}

function innerArticleAuthorTypeChange(selectedRole) {
  const authorFirstName = document.getElementById('input-tekija-etunimi');
  const authorLastName = document.getElementById('input-tekija-sukunimi');
  const authorCorporateName = document.getElementById('input-tekija-yhteison-nimi');
  const authorSearch = document.getElementById('input-tekija-haku-osio');
  const authorSelect = document.getElementById('input-tekija-lisaa-select');

  const organization = document.getElementById('input-tekija-ainoa-organisaatio');
  // TODO: FIN11 needs searchbox and and dropdown menu for results

  if (selectedRole === 'yhteisö') {
    authorFirstName.style.display = 'none';
    authorLastName.style.display = 'none';
    authorCorporateName.style.display = 'flex';
    authorSearch.style.display = 'none';
    authorSelect.style.display = 'none';
    organization.style.display = 'none';
    return;
  }
  // person:
  if (selectedRole === 'henkilö') {
    authorFirstName.style.display = 'flex';
    authorLastName.style.display = 'flex';
    authorCorporateName.style.display = 'none';
    authorSearch.style.display = 'none';
    authorSelect.style.display = 'none';
    organization.style.display = 'flex';
  }

  if (selectedRole === 'FIN11') {
    authorFirstName.style.display = 'none';
    authorLastName.style.display = 'none';
    authorCorporateName.style.display = 'none';
    authorSearch.style.display = 'flex';
    authorSelect.style.display = 'flex';
    organization.style.display = 'flex'; // This should be hidden for non-100 results...
  }

}

window.articleAuthorTypeChange = (event) => {
  const selectedRole = event.target.value;
  innerArticleAuthorTypeChange(selectedRole);
}

window.resetAuthor = (event) => {
  event.preventDefault();
  idbClear('artoAuthorTempOrg').then(() => {
    //const organizationList = document.getElementById('tekija-organisaatiot-list');
    const authorRoleSelect = document.getElementById('tekija-rooli'); // should we have this for tekija-ainoa-organisaatio?
    //organizationList.innerHTML = '';
    document.getElementById('tekija-etunimi').value = '';
    document.getElementById('tekija-sukunimi').value = '';
    document.getElementById('tekija-yhteison-nimi').value = '';
    //document.getElementById('tekija-organisaatio').value = '';
    document.getElementById('tekija-rooli').value = 'kirjoittaja';
    document.getElementById('tekija-ainoa-organisaatio').value = '';
    document.getElementById('tekija-henkilo-vs-yhteiso').value = 'henkilö';
    innerArticleAuthorTypeChange('henkilö');
    checkArticleForm();
    return authorRoleSelect.dispatchEvent(new Event('change'));
  });
};

window.removeAuthor = (event, key) => {
  event.preventDefault();
  idbDel('artoAuthors', key).then(() => refreshAuthorsList());
};

window.removeOrgForAuthor = (event, key) => {
  event.preventDefault();
  idbDel('artoAuthorTempOrg', key).then(() => refreshAuthorOrganizationList());
};

function resetAuthorSelect(searching) {
  const select = document.getElementById('input-tekija-haku-tulos-lista');
  select.innerHTML = '';

  if (searching) {
    resetSessionStoreList('authorTempList');
    return setOptions(select, [{value: '', text: 'Etsitään...'}], true);
  }

  setOptions(select, [{value: '', text: 'Ei tuloksia'}], true);
}

function searchAuthors(event) {
    event.preventDefault();
    resetAuthorSelect(true);
    //// We can't use fromToJson() here, as the event is not a submit. I'm not sure if that's the right way to do it, anyways. 
    //const formJson = formToJson(event);
    //const query = `${formJson['tekija-haku-arvo']}*`;

    const query = document.getElementById('tekija-haku-arvo').value

    // Added an asterisk (*) after formJson['asiasana-haku-arvo'] in order to find more matches/options with the search feature
    getOntologyWords('kanto', query)
      .then((data) => {
        setSearchResults(data.results)
      })
      .catch((error) => setSearchResults([]));

    function setSearchResults(words) {
      if (words.length === 0) {
        return resetAuthorSelect();
      }

      const select = document.getElementById('input-tekija-haku-tulos-lista');
      const data = words.map((word, index) => {
        const title = `${word.prefLabel}${word.altLabel ? ` (${word.altLabel})` : ''}`;
        addValueToSessionStoreList('authorTempList', {identifier: index, ...word});
        return {value: index, text: title};
      });

      setOptions(select, data);
    }

}

function addAuthor(event) {
  event.preventDefault();
  const formJson = formToJson(event);
  const asteriAuthor = getAsteriAuthor();

  function getAsteriAuthor() {
    return getSessionStoreValue('authorTempList', formJson['input-tekija-haku-tulos-lista']);
  }

  // NV: authorsTempOrganizations is not really used nowadays...
  idbGetStoredValues('artoAuthorTempOrg').then(authorsTempOrganizations => {

    const data = {
      firstName: formJson['tekija-etunimi'],
      lastName: formJson['tekija-sukunimi'],
      corporateName: formJson['tekija-yhteison-nimi'],
      relator: formJson['tekija-rooli'],
      type: formJson['tekija-henkilo-vs-yhteiso'],
      asteriAuthor,
      authorsOrganization : formJson['tekija-ainoa-organisaatio'],
      authorsTempOrganizations
    };

    //const organizationInputField = document.getElementById('tekija-organisaatio');

    if (data.type === 'henkilö' && data.lastName === '') {
      showSnackbar({text: 'Tekijän sukunimi ei voi olla tyhjä', closeButton: 'true'});
      return;
    }

    if (data.type === 'yhteisö' && data.corporateName === '') {
      showSnackbar({text: 'Yhteisön nimi ei voi olla tyhjä', closeButton: 'true'});
      return;
    }

    if (data.type === 'FIN11') {
      if (!asteriAuthor || !asteriAuthor.tag) {
        showSnackbar({text: 'Asteri-nimi ei voi olla tyhjä', closeButton: 'true'});
        return;
      }
    }

    if (data.lastName === ' ' || data.firstName === ' ' || data.corporateName === ' ') {
      // Ye olde hack to prevent record from having a 700 field:
      if ( !(data.type === 'henkilö' && data.firstName === ' ' && data.lastName === ' ') ) {
        showSnackbar({text: 'Tarkista kentät: tekijän nimi ei voi olla välilyönti', closeButton: 'true'});
        return;
      }
    }

    /*
    if (organizationInputField.value !== '') {
      showSnackbar({style: 'alert', text: 'Organisaation lisääminen tekijälle on kesken', closeButton: 'true'});
      return;
    }
    */

    idbAddValueToLastIndex('artoAuthors', data).then(() => {
      resetAuthor(event);
      refreshAuthorsList();
      resetAuthorSelect();
    });
  });
}

/*
function addOrganizationForAuthor(event) {
  event.preventDefault();
  const formJson = formToJson(event);
  const organizationInputValue = formJson['tekija-organisaatio'];

  if (organizationInputValue === '') {
    showSnackbar({style: 'alert', text: 'Organisaatio ei voi olla tyhjä'});
    return;
  }

  // See if this can be simplified or optimized (e.g. by utilizing event.target etc)
  const code = document.querySelector(`#tekija-organisaatio-lista [value="${organizationInputValue}"]`)?.dataset.code

  if (!code) {
    showSnackbar({style: 'alert', text: 'Valitse organisaatio listasta'});
    return;
  }

  const [organizationName = false, note = false] = organizationInputValue.replace(' (uusi)', '').replace(' (vanha)', '').split(' - ');

  idbGetStoredValues('artoAuthorTempOrg').then(organizations => {
    if (organizations.some(org => org.organizationName === organizationName || org.code === code)) {
      showSnackbar({style: 'alert', text: 'Tekijälle on jo lisätty tämä organisaatio'});
      return;
    }

    idbAddValueToLastIndex('artoAuthorTempOrg', {organizationName, code, note}).then(() => {
      document.getElementById('tekija-organisaatio').value = '';
      refreshAuthorOrganizationList();
    });
  });
}
  */

function clearAuthors(event) {
  event.preventDefault();
  idbClear('artoAuthors').then(() => refreshAuthorsList());
}
