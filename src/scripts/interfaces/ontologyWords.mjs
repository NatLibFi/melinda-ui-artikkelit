/*****************************************************************************/
/* FORM INTERFACE FOR ONTOLOGY WORDS                                         */
/*****************************************************************************/


/* Local imports */
import {idbAddValueToLastIndex, idbClear, idbDel, idbGetStoredValues} from '/scripts/indexedDB.mjs';
import {addValueToSessionStoreList, getSessionStoreValue, resetSessionStoreList} from '/scripts/sessionStorage.mjs';
import {getOntologyWords} from '/scripts/restCalls.mjs';
import {formToJson, createIconButton, createP, setOptions} from '/scripts/utils.mjs';

/* Shared imports */
import {showSnackbar} from '/shared/scripts/snackbar.js';

/*****************************************************************************/
const ontologyTableName = 'artoOntologyWords';

export function initOntologyWords() {
  //console.log('initializing ontology...');

  document.getElementById('asiasana-lisaa-form').addEventListener('submit', addOntologyWord);
  document.getElementById('tyhjenna-asiasanat-form').addEventListener('submit', clearOntologyWords);
  document.getElementById('asiasana-haku-yso-form').addEventListener('submit', searchOntologyWords);
  document.getElementById('asiasana-ontologia').addEventListener('change', ontologyTypeChange);

  resetOntologyQuery();
  resetOntologySelect();
  refreshOntologyWordList();
}


export function ontologyTypeChange(event) {
  event.preventDefault();
  const ontologyType = event.target.value;

  if ((/other/).test(ontologyType)) {
    document.getElementById('haku-osio').style.display = 'none';
    document.getElementById('asiasana-lisaa-select').style.display = 'none';
    document.getElementById('asiasana-lisaa-input').style.display = 'flex';
    const opts = event.target.options;
    document.getElementById('asiasana-muu-label').innerHTML = `${opts[opts.selectedIndex].text}`;
    resetOntologySelect();
    return;
  }

  document.getElementById('haku-osio').style.display = 'flex';
  document.getElementById('asiasana-lisaa-select').style.display = 'flex';
  document.getElementById('asiasana-lisaa-input').style.display = 'none';
  document.getElementById('asiasana-muu-label').innerHTML = '';
  document.getElementById('asiasana-muu').value = '';
}


window.removeOntologyWord = (event, key) => {
  event.preventDefault();
  idbDel(ontologyTableName, key).then(() => refreshOntologyWordList(event));
};


function addOntologyWord(event) {
  event.preventDefault();

  const formJson = formToJson(event);
  const ontologyWord = getOntologyWord();
  const ontologyWordOther = getOntologyWordOther(); // 653 + non-Asteri 600/610

  if (!ontologyWord) {
    if (!ontologyWordOther || !ontologyWordOther.prefLabel) {
      showSnackbar({style: 'alert', text: 'Asiasana tai avainsana ei voi olla tyhjä'});
      return;
    }
  }

  addOntologyWordToIndexedDb(ontologyWord ?? ontologyWordOther);

  function getOntologyWord() {
    return getSessionStoreValue('ontologyTempList', formJson['asiasana-haku-tulos-lista']);
  }


  function getOntologyWordOther() {
    const select = document.getElementById("asiasana-ontologia");
    const ontologySelectLabel = formJson['asiasana-muu'];
    const ontologySelectValue = select.value;
    const ontologySelectText = select.options[select.selectedIndex].text;

    return {
      prefLabel: ontologySelectLabel,
      vocab: ontologySelectValue,
      text: ontologySelectText
    }
  };


  function addOntologyWordToIndexedDb(newWord) {
    idbGetStoredValues(ontologyTableName)
    .then((words) => {
      if (words.some(match)) {
        showSnackbar({style: 'alert', text: 'Artikkelille on jo lisätty tämä asia-/avainsana'});
        return;
      }

      idbAddValueToLastIndex(ontologyTableName, newWord)
        .then(() => {
          resetOntologyOtherInput();
          resetOntologyQuery();
          resetOntologySelect();
          refreshOntologyWordList(event);
      });
    });


    function match(word) {
      if (word.vocab !== newWord.vocab || word.lang !== newWord.lang) {
        return false;
      }
      return newWord.localname
        ? word.localname === newWord.localname
        : word.prefLabel === newWord.prefLabel;
    }

  }

  function resetOntologyOtherInput() {
    const otherInputField = document.getElementById('asiasana-muu');
    otherInputField.value = '';
  }

}


function clearOntologyWords(event) {
  event.preventDefault();

  idbClear(ontologyTableName)
    .then(() => {
      refreshOntologyWordList(event);
    });
}


function searchOntologyWords(event) {
  event.preventDefault();
  resetOntologySelect(true);
  const formJson = formToJson(event);

  // Added an asterisk (*) after formJson['asiasana-haku-arvo'] in order to find more matches/options with the search feature
  getOntologyWords(formJson['asiasana-ontologia'], `${formJson['asiasana-haku-arvo']}*`)
    .then((data) => {
      setOntologyWords(data.results)
    })
    .catch((error) => setOntologyWords([]));


  function setOntologyWords(words) {
    if (words.length === 0) {
      return resetOntologySelect();
    }

    const select = document.getElementById('asiasana-haku-tulos-lista');
    const data = words.map((word, index) => {
      const title = `${word.prefLabel}${word.altLabel ? ` (${word.altLabel})` : ''}`;
      addValueToSessionStoreList('ontologyTempList', {identifier: index, ...word});
      return {value: index, text: title};
    });

    setOptions(select, data);
  }
}

function resetOntologyQuery() {
  const elem = document.getElementById('asiasana-haku-arvo');
  elem.value = '';
}


function resetOntologySelect(searching) {
  const select = document.getElementById('asiasana-haku-tulos-lista');
  select.innerHTML = '';

  if (searching) {
    resetSessionStoreList('ontologyTempList');
    return setOptions(select, [{value: '', text: 'Etsitään...'}], true);
  }

  setOptions(select, [{value: '', text: 'Ei tuloksia'}], true);
}


export function refreshOntologyWordList(event = undefined, skipUpdate = false) {
  const ontologyWordList = document.getElementById('asiasana-list');
  ontologyWordList.innerHTML = '';

  idbGetStoredValues(ontologyTableName).then(ontologyWords => {
    ontologyWords.forEach(wordData => {
      const form = document.createElement('form');
      const div = document.createElement('div');
      div.classList.add('full-width');
      const removeButton = createIconButton('delete_outline', ['alternate-red', 'small'], `return removeOntologyWord(event, ${wordData.key})`, 'Poista');
      div.appendChild(createP('Asia- tai avainsana', '', '&nbsp;-&nbsp;', ['label-text']));
      const pRelator = createP(wordData.prefLabel);
      //pRelator.classList.add('capitalize'); // NV disabled this on 2024-06-19. Esp. multiword keyword look stupid with this, eg. Wari'n Kieli
      div.appendChild(pRelator);
      div.appendChild(generateVocabInfo(wordData));
      if (!(/other/u ).test(wordData.vocab)) {
        div.appendChild(createP(`<a href="${wordData.uri}" target="_black">${wordData.uri}</a>`, '&nbsp;-&nbsp;', '', ['long-text']));
      }
      div.appendChild(removeButton);
      form.appendChild(div);
      ontologyWordList.appendChild(form);
    });

    if (ontologyWords.length > 1) {
      document.getElementById('tyhjenna-asiasanat-form').style.display = 'block';
    }

    if (ontologyWords.length < 2) {
      document.getElementById('tyhjenna-asiasanat-form').style.display = 'none';
    }
  });

  function mapTwoLetterLanguageCodeToThreeLetterLanguageCode(code) {
    if (code === 'en') {
      return 'eng';
    }
    if (code === 'fi') {
      return 'fin';
    }
    if (code === 'sv') {
      return 'swe';
    }
    return code;
  }

  function generateVocabInfo(word) {
    const languageCode = mapTwoLetterLanguageCodeToThreeLetterLanguageCode(word.lang);

    if (['yso-paikat', 'yso-aika'].includes(word.vocab)) {
      return createP(`yso/${languageCode} (${word.vocab})`, '&nbsp;-&nbsp;');
    }
    if ((/other/).test(word.vocab)) {
      return createP(`${word.text}`, '&nbsp;-&nbsp;');
    }
    if (['finaf', 'koko'].includes(word.vocab)) { // monolingual lexica/ontologies don't need show the language code
      return createP(`${word.vocab}`, '&nbsp;-&nbsp;');
    }
    return createP(`${word.vocab}/${languageCode}`, '&nbsp;-&nbsp;');
  }

  if (!skipUpdate) {
    //console.info("NV refreshOntologyWordList()");
    doUpdate(event);
  }
}
