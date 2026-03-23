/*****************************************************************************/
/* FORM INTERFACE FOR ARTICLE BASIC DETAILS                                  */
/*****************************************************************************/


/* Local imports */
import {fillArticleTypeOptions, fillDatalistOptions} from '/scripts/actions/articleFillOptions.mjs';
import {setRequiredFields} from '/scripts/actions/articleValidateForm.mjs';
//import {refreshReviewsList} from '/scripts/interfaces/reviewSearch.mjs';
//import {idbClear} from '/scripts/indexedDB.mjs';
import {createIconButton} from '/scripts/utils.mjs';

/*****************************************************************************/


export function initArticleBasicDetails() {
  //console.log('initializing article...');
  document.getElementById('lisaa-linkki').addEventListener('click', addArticleLink);
  resetAndHideCcLicense();
}

export function resetAndHideCcLicense() {
  const ccLicenseSelect = document.getElementById('artikkelin-cc-lisenssi');
  const ccLicenseFormField = document.getElementById('artikkelin-cc-lisenssi-wrap');

  ccLicenseSelect.selectedIndex = 0;
  hideCcLicense();

  function hideCcLicense() {
    ccLicenseFormField.style.display = 'none';
    ccLicenseSelect.disabled = true;
  }
}

export function sourceTypeChange(event) {
  event.preventDefault();
  fillDatalistOptions();
  fillArticleTypeOptions();

  const sourceType = event.target.value;
  const optionIsbn = document.querySelector(`select#julkaisu-haku-tyyppi option[value='isbn']`);
  const optionIssn = document.querySelector(`select#julkaisu-haku-tyyppi option[value="issn"]`);

  const sourceTypeSelect = document.querySelector('select#kuvailtava-kohde');
  const sourceTypePreview = document.getElementById('sourceTypePreview');

  sourceTypePreview.innerHTML = sourceTypeSelect.options[sourceTypeSelect.selectedIndex].text

  if (sourceType === 'journal') {
    document.getElementById(`numeron-vuosi-wrap`).style.display = 'block';
    document.getElementById(`numeron-vol-wrap`).style.display = 'block';
    document.getElementById(`numeron-numero-wrap`).style.display = 'block';
    document.getElementById(`artikkelin-osasto-toistuva-wrap`).style.display = 'block';
    document.getElementById(`lehden-tunniste-label`).innerHTML = 'ISSN';
    document.getElementById('lehden-vuodet-label').innerHTML = 'Julkaisuvuodet';
    optionIsbn.setAttribute('hidden', 'hidden');
    optionIssn.removeAttribute('hidden');
  }

  if (sourceType === 'book') {
    document.getElementById(`numeron-vuosi-wrap`).style.display = 'none';
    document.getElementById(`numeron-vuosi`).value = '';
    document.getElementById(`numeron-vol-wrap`).style.display = 'none';
    document.getElementById(`numeron-vol`).value = '';
    document.getElementById(`numeron-numero-wrap`).style.display = 'none';
    document.getElementById(`numeron-numero`).value = '';
    document.getElementById(`artikkelin-osasto-toistuva-wrap`).style.display = 'none';
    document.getElementById(`lehden-tunniste-label`).innerHTML = 'ISBN';
    document.getElementById('artikkelin-osasto-toistuva').value = '';
    document.getElementById('lehden-vuodet-label').innerHTML = 'Julkaisuvuosi';
    optionIssn.setAttribute('hidden', 'hidden');
    optionIsbn.removeAttribute('hidden')
  }

  setRequiredFields();
  document.getElementById('julkaisu-haku-tulos-lista').dispatchEvent(new Event('change'));
  //console.info("NV sourceTypeChange()");
  doUpdate();
}

export function showCcLicense() {
  const ccLicenseFormField = document.getElementById('artikkelin-cc-lisenssi-wrap');
  const ccLicenseSelect = document.getElementById('artikkelin-cc-lisenssi');

  ccLicenseFormField.style.display = 'block';
  ccLicenseSelect.removeAttribute('disabled');
}

window.articleTypeChange = (event) => {
  // NV: The commented code below removes reviews.
  // First I thought it was a copy-paste error, but now I think it was added on purpose.
  // However, it's a bad idea. It's semantically wrong to do it this way.
  /*
  const reviewFieldset = document.getElementById('arvostellun-teoksen-tiedot');
  const addedReviews = document.getElementById('arvostellut-teokset');
  const selectedType = event.target.value;

  reviewFieldset.style.display = 'flex';
  addedReviews.style.display = 'flex';

  if (['A1', 'A2', 'A3'].some(str => selectedType.includes(str))) {
    reviewFieldset.style.display = 'none';
    addedReviews.style.display = 'none';
    idbClear('artoReviews');
    resetReview();
    refreshReviewsList();
  }
  */
};

window.removeArticleLink = (event) => {
  event.preventDefault();
  event.target.parentElement.remove();
  //console.info("NV removeArticleLink()");
  doUpdate(event);
};

function addArticleLink(event) {
  event.preventDefault();
  const articleWrap = document.getElementById('artikkelin-linkki-wrap');
  const upperDiv = document.createElement('div');
  upperDiv.classList.add('full-width');
  const lowerDiv = document.createElement('div');
  lowerDiv.classList.add('Input');
  const removeButton = createIconButton('delete_outline', ['alternate-red', 'small'], `return removeArticleLink(event)`, 'Poista');
  lowerDiv.appendChild(createLabel('artikkelin-linkki'));
  lowerDiv.appendChild(createInput('artikkelin-linkki'));
  upperDiv.appendChild(lowerDiv);
  upperDiv.appendChild(removeButton);
  articleWrap.appendChild(upperDiv);

  function createLabel(id) {
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.innerHTML = 'Linkki kokotekstiin';
    return label;
  }

  function createInput(name) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', name);
    input.setAttribute('name', name);
    input.setAttribute('maxLength', 128);
    return input;
  }
}
