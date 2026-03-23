//import {localReducers} from "@natlibfi/melinda-marc-record-merge-reducers/dist/reducers";

import {splitString} from "./generateUtils.js";



function trimString(string) {
  // Convert all whitespaces to ' ' and collapse them + trim ends.
  return string.replace(/\s+/gu, ' ').replace(/^\s+/u, '').replace(/\s+$/u, '');
}

function normalizeAndPunctuateValue(value) {
  const normalizedValue = trimString(value);
  // NB! Generic punctuation2 validator/fixer needs tunings before we can remove addDotIfNeeded() stuff from here
  return `${normalizedValue}${addDotIfNeeded(normalizedValue)}`;
}

export function generatef500(notes = false) {

  if (notes) {
    return notes.map(note => ({
      tag: '500',
      ind1: ' ',
      ind2: ' ',
      subfields: [{code: 'a', value: normalizeAndPunctuateValue(note.value)}]
    }));
  }

  return [];
}

export function generatef506(referenceLinks, isElectronic) {

  if (isElectronic && referenceLinks && referenceLinks[0].length > 0) {
    return [
      {
        tag: '506',
        ind1: '0',
        ind2: ' ',
        subfields: [
          {code: 'a', value: 'Aineisto on vapaasti saatavissa.'},
          {code: 'f', value: 'Unrestricted online access'},
          {code: '2', value: 'star'}
        ]
      }
    ];
  }
  return [];
}

export function generatef520(abstracts, results = [], index = 1) {
  if (!abstracts) {
    return results;
  }
  // console.log(`NV: ${typeof abstracts}`);

  const [currAbstract, ...remainingAbstracts] = abstracts;
  if (!currAbstract) {
    return results;
  }

  const newFields = abstractToFields(normalizeAndPunctuateValue(currAbstract.abstract), index);
  const nextIndex =  newFields.length > 1 ? index + 1 : index;

  return generatef520(remainingAbstracts, [...results, ...newFields], nextIndex);


  function abstractToFields(abstract, index1) {
    // console.log("abstractToField()...");
    const elements = splitString(abstract, 1000);
    if (elements.length === 1) {
      // TODO: better indicator values
      return [strToField520(abstract)];
    }
    return elements.map((str, index2) => strToField520(trimString(str), index1, index2+1));
  }

  function get520Ind1(str, index) {
    if (index !== 0) {
      return ' ';
    }
    if (['Abstract.', 'Abstrakt.', 'Abstrakti.', 'Abstract.', 'English Summary.', 'Sammandrag.', 'Tiivistelmä'].includes(str)) {
      return '8'; // 8="Näyttötekstiä ei muodosteta"
    }
    return ' ';
  }



  function strToField520(str, index1 = 0, index2 = 0) {
    const subfieldA = {
      code: 'a', value: str
    }
    const ind1 = get520Ind1(str, index1);

    const subfields = index1 === 0 ? [subfieldA] : [{code: '8', value: `${index1}.${index2}\\x`}, subfieldA];

    return {
      tag: '520',
      ind1,
      ind2: ' ' ,
      subfields
    };
  }
}

const licenseMap = [
  {license: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/deed.fi'},
  {license:'CC BY-NC 4.0', url: 'https://creativecommons.org/licenses/by-nc/4.0/deed.fi'},
  {license:'CC BY-NC-ND 4.0', url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.fi'},
  {license:'CC BY-NC-SA 4.0', url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fi'},
  {license:'CC BY-ND 4.0', url: 'https://creativecommons.org/licenses/by-nd/4.0/deed.fi'},
  {license:'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.fi'},
  {license:'CC0 1.0', url: 'https://creativecommons.org/publicdomain/zero/1.0/deed.fi'},
  {license:'Public Domain 1.0', url: 'https://creativecommons.org/publicdomain/mark/1.0/deed.fi'}
];

export function generatef540(article) {
  //supported licenses:
  if (!article || !article.ccLicense) {
    return [];
  }

  const [row] = licenseMap.filter(row => row.license === article.ccLicense);
  if (row) {
    return [
      { tag: '540', ind1: ' ', ind2: ' ', subfields: [
          {code: 'f', value: article.ccLicense},
          {code: '2', value: 'cc'},
          {code: 'u', value: row.url}
        ]
      }
    ];
  }

  return [];
}

export function generatef567(methodologies) {
  if (methodologies) {
    return methodologies.map(methodology => ({tag: '567', ind1: ' ', ind2: ' ', subfields: [{code: 'a', value: `${methodology.value}.`}]}));
  }

  return [];
}

export function generatef591(articleSciences = [], articleCategory) { // = sciences, article.type

  if (!articleCategory) { // Require only 591$d. Emprically 99,9% of ARTO 591 fields have at least it. $h$i is much rarer.
    return [];
  }

  const [codeOfCategory] = articleCategory.split(' ', 1);
  return [{tag: '591', ind1: ' ', ind2: ' ', subfields: [{code: 'd', value: codeOfCategory}, ...selectArticleSciences(articleSciences), {code: '5', value: 'ARTO'}]}];

  function selectArticleSciences(articleSciences) {
    return articleSciences.flatMap(science => [{code: 'h', value: science.subject}, {code: 'i', value: science.subCategory}]);
  }
}


export function generatef598(f598) {
  if (f598) {
    return [{tag: '598', ind1: ' ', ind2: ' ', subfields: [{code: 'a', value: f598}, {code: '5', value: 'ARTO'}]}];
  }

  return [];
}

export function generatef599(f599a, f599x) {
  if (f599a || f599x) {
    return [
      {tag: '599',
        ind1: ' ',
        ind2: ' ',
        subfields: [{code: 'a', value: f599a}, {code: 'x', value: f599x}, {code: '5', value: 'ARTO'}]}
    ];
  }
  return [];
}

function addDotIfNeeded(checkThis) {
  const string = checkThis.trim();
  const stringLength = string.length;
  const lastChar = string.charAt(stringLength - 1);
  if (lastChar === '.' || lastChar === '?' || lastChar === '!') {
    return '';
  }
  return '.';
}
