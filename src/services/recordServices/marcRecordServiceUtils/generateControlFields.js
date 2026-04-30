import {isSamiLanguage} from "./generateUtils.js";

export function generateLeader(sourceType) {
  // LDR/07 ('a' vs 'b'): We now do things properly and use 'a' for journals as well. See MELINDA-7427 for some past discussion.
  return '00000naa a22000005i 4500';
}

export function generatef005() {
  return [{tag: '005', value: '00000000000000.0'}];
}

export function generatef007(isElectronic = false) {
  if (isElectronic) {
    return [{tag: '007', value: 'cr |||||||||||'}];
  }

  return [];
}

export function generatef008(useMoment, publYear, country = 'fi ', sourceType, isElectronic, languageCode) {
  function checkPublYear(publYear) {
    const defaultValue = '    '; // '^^^^'
    if (!publYear || !publYear.length) {
      return defaultValue;
    }
    if (publYear.length !== 4) {
      if (publYear.match(/^\[....\]\.?$/u)) {
        return publYear.substring(1, 5);
      }
      if (publYear.match(/^....\.$/u)) {
        return publYear.substring(0, 4);
      }
      return defaultValue;
    }
    return publYear;
  }

  function checkLanguage() {
    if (!languageCode || ['zxx', 'und', '   ', 'mul', 'sgn'].includes(languageCode)) {
      return '|||';
    }

    if (isSamiLanguage(languageCode)) {
      return 'smi';
    }

    return languageCode;
  }

  const publYear2 = '    '; // 11-14: 'Julkaisuvuosi 2' = 4x space = '^^^^'
  // country: 15-17 'Julkaisu-, tuotanto- tai toteuttamismaa', default: 'fi^'
  const places18to22 = '|| ||'; // 'Ilmestymistiheys, Säännöllisyys, 20 Määrittelemätön, Jatkuvan julkaisun tyyppi, Alkuperäisen julkaisun ilmiasu', '||^||'
  // place 23 = selectMaterialType:  'Ilmiasu': Painetut artikkelit: tyhjä / Elektroniset artikkelit: o ("Verkkoaineisto")
  const places24to35 = '||||||   ||'; // '||||||^^^||'
  const f008Parts = [dateFormatted(useMoment), 's', checkPublYear(publYear), publYear2, country, places18to22, selectMaterialType(sourceType, isElectronic), places24to35, checkLanguage(), ' c']; // '^c'

  return [{tag: '008', value: f008Parts.join('')}];

  function selectMaterialType(sourceType, isElectronic) {
    if (sourceType === 'book') {
      if (isElectronic) {
        return 'o';
      }

      return ' '; // '^'
    }

    if (sourceType === 'journal') {
      if (isElectronic) {
        return 'o';
      }

      return ' '; // '^'
    }
  }
}

export function dateFormatted (useMoment) {
  if (useMoment === 'now') {
    const dateNow = new Date();
    const useDate = dateNow.toISOString().split('T')[0].replace(/-/gu, '').slice(2, 8); // YYMMDD
    return useDate;
  }

  return '000101';
}
