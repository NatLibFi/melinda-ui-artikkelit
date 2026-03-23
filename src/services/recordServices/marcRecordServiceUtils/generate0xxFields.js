import {isSamiLanguage, onlyUnique, uniqArray} from './generateUtils.js';

export function generatef040() {
  return [{ tag: '040', ind1: ' ', ind2: ' ', subfields: [
    {code: 'b', value: 'fin'},
    {code: 'e', value: 'rda'}
  ] }];
}

export function generatef041(articleLanguage, abstractLanguages) {

  if (!articleLanguage) {
    return [];
  }

  const subfieldAs = languagesToSubfields([articleLanguage], 'a');
  const subfieldBs = languagesToSubfields(abstractLanguages, 'b');
  if (subfieldAs.length === 0 && abstractLanguages.length === 0) {
    return [];
  }
  return [{ tag: '041', ind1: ' ', ind2: ' ', subfields: [...subfieldAs, ...subfieldBs] }];

  function mapLanguage(language) {
    // NB! 'smi' is a generic term for all Sami languages.
    // If any sami language is used, both generic and specific term should be used, *and* generic term should be used first (and in 008/35-37)!
    // See https://www.kiwi.fi/display/kumea/2022-05-18 for details!
    if (isSamiLanguage(language)) {
      return ['smi', language];
    }
    return [language];
  }

  function mapLanguages(remainingInputLanguages, outputLanguages = []) {
    if (!remainingInputLanguages || remainingInputLanguages.length === 0) {
      return outputLanguages;
    }

    const [currLanguage, ...stillToDo] = remainingInputLanguages;

    const moreOutputLanguages = mapLanguage(currLanguage);
    return mapLanguages(stillToDo, [...outputLanguages, ...moreOutputLanguages]);
  }

  function languagesToSubfields(languages, subfieldCode) {
    // NV 20240823: Prevent '|||' as abstract part let it through.
    const mappedLanguages = uniqArray(mapLanguages(languages)).filter(val => val !== '|||');
    return mappedLanguages.map(val => {
      return {'code': subfieldCode, 'value': val};
    });
  }
}

export function generatef080(udks) {

  if (!udks) {
    return [];
  }

  const udkResult = udks.map(buildRows);

  function buildRows(element) {
    if (element !== undefined) {
      return {
        tag: '080',
        ind1: ' ',
        ind2: ' ',
        subfields: buildSubfields(element)
      };
    }
  }

  return udkResult;

  function buildSubfields(element) {
    if (element.a080 && !element.x080 && !element.two080) {
      return [{code: 'a', value: element.a080}];
    }

    if (element.a080 && element.x080 && !element.two080) {
      return [{code: 'a', value: element.a080}, {code: 'x', value: element.x080}];
    }

    if (element.a080 && !element.x080 && element.two080) {
      return [{code: 'a', value: element.a080}, {code: '2', value: element.two080}];
    }

    if (element.a080 && element.x080 && element.two080) {
      return [{code: 'a', value: element.a080}, {code: 'x', value: element.x080}, {code: '2', value: element.two080}];
    }

  }
}

export function generatef084(otherRatings = false) {
  if (!otherRatings) {
    return [];
  }

  const otherRatingsResult = otherRatings.map(buildRows);

  function buildRows(element) {
    if (element !== undefined) {
      return {
        tag: '084',
        ind1: ' ',
        ind2: ' ',
        subfields: [
          {code: 'a', value: element.a084},
          {code: '2', value: element.two084}
        ]
      };
    }
  }

  return otherRatingsResult;
}
