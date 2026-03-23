export function generatef6xxs(terms) {
  //console.info(`TERM: ${JSON.stringify(terms)}`);
  if (!terms) {
    return [];
  }

  //terms.forEach(t => console.info(JSON.stringify(t))); // these settings can be used as test input

  return terms.flatMap((term) => {
    const vocab = term.vocab;
    const prefLabel = term.prefLabel;
    const lang = term.lang;
    const uri = term.uri;
    const type = term.type;
    const localname = term.localname;

    //console.info(`VOCAB: ${vocab}\nprefLabel: ${prefLabel}\nlang: ${lang}\nuri: ${uri}\n`);
    if (!prefLabel) {
      return [];
    }

    if (term.vocab === 'finaf' && term.tag) {
      return generateAsteriBaseField(term, '6');
    }

    if (['otherPerson'].includes(vocab)) {
      return generatef600(prefLabel);
    }

    if (['otherCommunity'].includes(vocab)) {
      return generatef610(prefLabel);
    }

    if(vocab === 'finaf') { // This can be either 600 or 610. Not sure if I got all corporate entities with the rule below:
      if (type && type[1] === "http://rdaregistry.info/Elements/c/C10005") {
        return generatef610(prefLabel, localname);
      }

      const parts = prefLabel.split(', ');
      if (parts.length > 1) {
        let years = parts.pop();
        if (years.length > 1 && years.match(/^(?:[12][0-9][0-9][0-9]\??-|(?:noin )?[12][0-9][0-9][0-9]\??-(?:noin )?[12][0-9][0-9][0-9]\??|kuollut (?:noin )?[0-9]{2,4})$/u)) {
          return generatef600(parts.join(', '), years, localname);
        }
      }

      return generatef600(prefLabel, undefined, localname);
    }

    if (['otherTime', 'yso-aika'].includes(vocab)) {
      return generatef648(vocab, prefLabel, lang, uri);
    }

    if (['yso', 'kassu', 'koko', 'soto', 'afo', 'finmesh', 'mesh', 'maotao'].includes(vocab)) {
      return generatef650(vocab, prefLabel, lang, uri);
    }

    if (['yso-paikat'].includes(vocab)) {
      return generatef651(vocab, prefLabel, lang, uri);
    }

    if (['other'].includes(vocab)) {
      return generatef653(prefLabel);
    }

    if (['slm', 'otherCategory'].includes(vocab)) {
      return generatef655(vocab, prefLabel, lang, uri);
    }

    throw new Error(`Invalid vocab! ${vocab}`);
  });
}

export function generateAsteriBaseField(term, hundred = '6') {
  const tensAndOnes = term.tag.substring(1);

  return [
    {
      tag: `${hundred}${tensAndOnes}`,
      ind1: term.ind1,
      ind2: hundred === '6' ? '4' : term.ind2,
      subfields: term.subfields
    }
  ];

}

function generatef600(prefLabel, lifespan = undefined, asteriId = undefined) {
  const subfield0 = asteriId ? [ {code: '0', value: `(FI-ASTERI-N)${asteriId}`}] : [];

  const subfieldD = lifespan ? [ {code: 'd', value: lifespan} ] : [];

  if (prefLabel.includes('$t')) { // NV: I have no idea who creates these, so I'm just leaving them as is... Looks iffy though.
    const splitted = prefLabel.split('$t');

    return [
      {tag: '600',
        ind1: '1',
        ind2: '4',
        subfields: [
          {code: 'a', value: splitted[0].trim()},
          ...subfieldD,
          {code: 't', value: splitted[1].trim()},
          ...subfield0
        ]}
    ];
  }

  // NB! Kanto does not explicitly tell us ind1 value. Lone words default to '1' (surname). This may be wrong though ('Kojo' is surname, and Danny is a Forename).
  // However, for multiwords, if there's no ', ', use exception value '0'. Not perfect but better than ye olde 'always 1'.
  const aValue = prefLabel.trim();
  return [{tag: '600', ind1: aValue.includes(' ') && !aValue.includes(', ') ? '0' : '1' , ind2: '4', subfields: [
    {code: 'a', value: aValue},
    ...subfieldD,
    ...subfield0
  ]}];
}

function generatef610(prefLabel, asteriId = undefined) {
  const subfield0 = asteriId ? [ {code: '0', value: `(FI-ASTERI-N)${asteriId}`}] : [];
  return [{tag: '610', ind1: '2', ind2: '4', subfields: [
    {code: 'a', value: prefLabel},
    ...subfield0
  ]}];
}

function generatef648(vocab, prefLabel, lang, uri) {
  if (vocab === 'otherTime') { // Typically single years. Apparently gets final '.' from somewhere (validators?) which is iffy or maybe even bad...
    return [
      {
        tag: '648', ind1: ' ', ind2: '4', // 2. ind -> 4
        subfields: [
          {code: 'a', value: prefLabel} // no subfield 2
        ]
      }
    ];
  }

  return [
    {
      tag: '648', ind1: ' ', ind2: '7',
      subfields: [
        {code: 'a', value: prefLabel},
        {code: '2', value: generateSubfield2Value(vocab, convertLangs(lang))},
        ...generateSubfield0()
      ]
    }
  ];

  function generateSubfield0() {
    if (vocab === 'yso-aika') {
      return [{code: '0', value: uri}];
    }

    return [];
  }

}

function generatef650(vocab, prefLabel, lang, uri) {
  if (vocab === 'mesh') {
    return [{tag: '650', ind1: ' ', ind2: '2',
        subfields: [
          {code: 'a', value: `${prefLabel}${prefLabel.slice(-1) === '.' ? '' : '.'}`}
          // {code: '0', value: uri} // Finto URI can't be right, can it...
        ]
      }
    ];
  }

  return [
    {
      tag: '650', ind1: ' ', ind2: '7', subfields: [
        {code: 'a', value: prefLabel},
        {code: '2', value: generateSubfield2Value(vocab, convertLangs(lang))},
        {code: '0', value: uri}
      ]
    }
  ];
}

function generatef651(vocab, prefLabel, lang, uri) {
  return [
    {
      tag: '651', ind1: ' ', ind2: '7',
      subfields: [
        {code: 'a', value: prefLabel},
        {code: '2', value: generateSubfield2Value(vocab, convertLangs(lang))},
        {code: '0', value: uri}
      ]
    }
  ];
}

function generatef653(prefLabel) {
  return [{tag: '653', ind1: ' ', ind2: ' ', subfields: [{code: 'a', value: prefLabel}]}];
}

function generatef655(vocab, prefLabel, lang, uri) {
  if (vocab === 'otherCategory') {
    return [{tag: '655', ind1: ' ', ind2: '4', subfields: [{code: 'a', value: prefLabel}]}];
  }

  return [
    {
      tag: '655', ind1: ' ', ind2: '7',
      subfields: [
        {code: 'a', value: prefLabel},
        {code: '2', value: generateSubfield2Value(vocab, convertLangs(lang))},
        {code: '0', value: uri}
      ]
    }
  ];
}

export function generatef655reviews(reviews) {
  if (reviews && Array.isArray(reviews) && reviews.length > 0) {
    return [
      {tag: '655', ind1: ' ', ind2: '7', subfields:
        [
          {code: 'a', value: 'kirja-arvostelut'},
          {code: '2', value: 'slm/fin'},
          {code: '0', value: 'http://urn.fi/URN:NBN:fi:au:slm:s1093'}
        ]}
    ];
  }
  return [];
}


function generateSubfield2Value(vocab, lang) {
  if (vocab === 'yso' || vocab === 'yso-paikat' || vocab === 'yso-aika') {
    return `yso/${lang}`;
  }

  if (vocab === 'slm' || vocab === 'fgf') {
    return `slm/${lang}`;
  }

  if (['afo', 'finmesh', 'kassu', 'koko', 'maotao', 'soto', ].includes(vocab)) {
    return vocab;
  }

  if (vocab === 'mesh') {
    return undefined;
  }

  throw new Error(`Invalid vocab info '${vocab}'!`);
}


function convertLangs(langCode) {
  if (langCode === 'fi') {
    return 'fin';
  }

  if (langCode === 'sv') {
    return 'swe';
  }

  return langCode;
}
