export function getSubfieldValue(record, fieldTagRegexp, code) {
  return record.get(fieldTagRegexp).flatMap(field => field.subfields.filter(sub => code === sub.code).map(sub => sub.value));
}



export function getPublicationYear(record) {
  const publicationFields = getPublicationYearFields();

  return publicationFields.flatMap(field => field.subfields.filter(sf => sf.code === 'c').map(sf => sf.value));


  function getPublicationYearFields() {
    return record.get(/^26[04]$/u).filter(f => f.tag === '260' || f.ind2 === '1').filter(f => f.subfields.some(sf => sf.code === 'c'));
  }
}

export function getSubfieldValues(record, fieldTagRegexp, codes) {
  const fields = record.get(fieldTagRegexp);

  if (fields.length < 1) {
    return [];
  }

  return fields.map(({subfields}) => codes.flatMap(code => subfields.filter(sub => sub.code === code)));
}

export function checkRecordType(wantedType, record) {

  if (!wantedType) {
    return true;
  }

  const {leader} = record;
  const c7 = leader.charAt(7);

  if (wantedType === 'journal') {
    return ['s', 'i'].includes(c7);
  }

  if (wantedType === 'book') {
    return c7 === 'm';
  }

  return true;
}

export function isComponentPart(record) {
  const {leader} = record;
  const ldr07 = leader.charAt(7);
  return ['a', 'b', 'd'].includes(ldr07);
}


const bibliographicalLevel = {
  'a': 'Osakohde monografiassa',
  'b': 'Osakohde kausijulkaisussa',
  'c': 'Kokoelma',
  'd': 'Osakohde kokoelmassa',
  'i': 'Päivittyvä julkaisu',
  'm': 'Monografia',
  's': 'Kausijulkaisu'
};

export function getRecordType(record) {
  const {leader} = record;
  const c7 = leader.charAt(7);
  if (c7 in bibliographicalLevel ) {
    return bibliographicalLevel[c7];
  }

  return false;
}

export function getSourceType(record) {
  const {leader} = record;
  const c67 = leader.substring(6,8);
  return `nn${c67}`;
}

export function getIsElectronic(record) {
  const [f008] = record.get(/^008/u);
  const formOfItem = f008.value.charAt(23); // In this Artiva context form of item resides always in char pos 23.
  return ['s', 'q', 'o'].includes(formOfItem);
}
