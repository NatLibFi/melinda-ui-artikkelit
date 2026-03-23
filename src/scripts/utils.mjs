/*****************************************************************************/
/* MISC HELPER FUNCTIONS FOR ARTICLE                                         */
/*****************************************************************************/


/* Local imports */
import {localOntologies, sweOntologies, engOntologies, vocabularies} from "/scripts/constants/ontologies.mjs";

/*****************************************************************************/

function ontologyToLanguageCode(ontology) {
  if (sweOntologies.includes(ontology)) {
    return 'sv';
  }
  if (engOntologies.includes(ontology)) {
    return 'en';
  }
  // console.info(`${ontology} defaults to Finto language code 'fi'`);
  return 'fi';
}

export function getOntologyOptions(ontology) {

  const searchVocab = vocabularies[ontology];
  const language = ontologyToLanguageCode(ontology);
  if (localOntologies.includes(ontology)) {
    return {
      searchVocab: 'local',
      language
    };
  }

  return {
    searchVocab,
    language
  };
}


// Helper function for sorting search result selects.
//---------------------------------------------------------------
// Returns record data sorted by the record's text.
// Search string and record data are given as parameters
// The records are first sorted into two groups
//    - records that have text which starts with searchString
//    - all the rest
// The two two groups are then both sorted alphabetically.
// Finally, sorted array is formed 
// with the records that start with the search string as first, 
// and the rest after those.
export function sortRecordData(searchString, data) {

  if (data === undefined || data.length === 0) {
    console.log('No record data to sort');
    return;
  }

  const startsWith = [];
  const rest = [];

  data.forEach(record => {

    if (record.text.toLowerCase().startsWith(searchString.toLowerCase()) && searchString !== undefined && searchString !== '') {
      startsWith.push(record);
      return;
    }

    rest.push(record);
  })

  const sortedRecordData = startsWith.sort(compareRecordTitles).concat(rest.sort(compareRecordTitles));
  return sortedRecordData;

  function compareRecordTitles(recordA, recordB) {
    return recordA.text.localeCompare(recordB.text);
  }
}

export function formToJson(formSubmitEvent) {
  const formData = new FormData(formSubmitEvent.target);
  const formJson = {};
  formData.forEach((value, key) => {
    if (key.indexOf('-array') > -1) {
      if (formJson[key] === undefined) {
        return formJson[key] = [value];
      }
      return formJson[key].push(value);
    }

    return formJson[key] = value;
  });
  return formJson;
}

export function setOptions(element, jsonArray, disabled = false, textValue = false, skipEvent = false) {
  element.innerHTML = '';
  if (textValue) {
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.innerHTML = textValue;
    element.append(defaultOpt);
  }
  jsonArray.forEach((obj, index) => {
    const opt = document.createElement('option');
    opt.value = obj.value;
    opt.innerHTML = obj.text;
    opt.selected = disabled;
    opt.disabled = disabled;
    if (obj.code) {
      opt.dataset.code = obj.code;
    }
    element.append(opt);
    if (element.nodeName === 'select' && index === 0) {
      element.selectedIndex = 0;
    }
  });

  if (!skipEvent) {
    element.dispatchEvent(new Event('change'));
  }
}

export function createIconButton(icon, classList = [], onclickAttribute = false, tooltip = false) {
  const button = document.createElement('button');
  button.innerHTML = icon;
  button.classList.add('material-symbols-outlined');
  button.classList.add('icon-only');

  classList.forEach(htmlClass => button.classList.add(htmlClass));
  if (onclickAttribute) {
    button.setAttribute('onclick', onclickAttribute);
  }

  if (tooltip) {
    button.classList.add('tooltip');
    button.setAttribute('tooltip-text', tooltip);
  }

  return button;
}

export function createP(value, before = '', after = '', classList = []) {
  const p = document.createElement('p');
  p.innerHTML = `${before}${value}${after}`;
  classList.forEach(htmlClass => p.classList.add(htmlClass));
  return p;
}