/*****************************************************************************/
/* PREFILL OPTIONS FOR FORM                                                  */
/*****************************************************************************/


/* Local imports */
import {
  articleTypesBooks, articleTypesJournal, authorRelators, authorTypes, ccLicenses,
  languages, ontologyTypes, organizations, sciences,
  searchFilters, searchTypes, sourceTypes
} from '/scripts/constants/constants.mjs';
import {setOptions} from '/scripts/utils.mjs';

/*****************************************************************************/


export function fillFormOptions() {
  fillSelectOptions();
  fillDatalistOptions();
  fillArticleTypeOptions();
}

function fillSelectOptions() {
  const selects = document.getElementsByTagName('select');

  for (let index = 0; index < selects.length; index += 1) {
    const select = selects[index];

    if (select.name === 'julkaisu-haku-rajaus') {
      setOptions(select, searchFilters);
    }

    if (select.name === 'kuvailtava-kohde') {
      setOptions(select, sourceTypes);
    }

    if (select.name === 'artikkelin-cc-lisenssi') {
      setOptions(select, ccLicenses, false, 'Ei CC-lisenssiä');
    }

    if (select.name.endsWith('-haku-tyyppi')) {
      setOptions(select, searchTypes);
    }

    if (select.name.endsWith('-kieli')) {
      setOptions(select, languages);
    }

    if (select.name.endsWith('-kieli')) {
      setOptions(select, languages);
    }

    if (select.name === 'lisatiedot-tieteenala-lista') {
      const sciences2 = sciences.map(sc => {
        return {'text': sc.value, 'value': sc.value};
      });
      setOptions(select, [{'text': 'Valitse tieteenala', 'value': ''}, ...sciences2]);
    }

    if (select.name === 'tekija-henkilo-vs-yhteiso') {
      setOptions(select, authorTypes);
    }

    if (select.name === 'tekija-ainoa-organisaatio') {
      // Tune existing struct for our one-org-only purposes (if and when we choose to stick with this modify original organization and simplify code here and there):
      const organizations2 = organizations.map(org => {
        return {'text': org.value, 'value': org.value, 'code': org.code};
      });
      setOptions(select, [{'text': '', 'value': '', 'code': ''}, ...organizations2]);
    }

    if (select.name.endsWith('-rooli')) {
      setOptions(select, authorRelators);
    }


    if (select.name.endsWith('-ontologia')) {
      setOptions(select, ontologyTypes);
    }

  }
}

export function fillDatalistOptions() {
  const datalists = document.getElementsByTagName('datalist');

  for (let index = 0; index < datalists.length; index += 1) {
    const datalist = datalists[index];

    if (datalist.id.endsWith('-tieteenala-lista')) {
      setOptions(datalist, sciences);
    }


    /*
    if (datalist.id.endsWith('-organisaatio-lista')) {
      setOptions(datalist, organizations);
    }
    */
  }
}

export function fillArticleTypeOptions() {
  const sourceType = document.querySelector('#kuvailtava-kohde').value;
  const articleType = document.querySelector('#artikkelin-tyyppi');

  if (sourceType === 'book') {
    setOptions(articleType, articleTypesBooks, false, 'Ei artikkelin tyyppiä');
  }

  if (sourceType === 'journal') {
    setOptions(articleType, articleTypesJournal, false, 'Ei artikkelin tyyppiä');
  }
}
