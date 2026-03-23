export function generatef773(sourceType, {publishingYear, volume, number, pages}, melindaId, isbn = '', issn = '', sourceTypeAsCode, titleFor773t) {
  if (!melindaId) {
    return [];
  }
  // Gather subfield data:
  const i = {code: 'i', value: `Sisältyy manifestaatioon:`};
  const t = {code: 't', value: titleFor773t ? `${titleFor773t}.`: ''};
  const g = getSubfieldG();
  const xz = getInternationalStandardNumber();
  const w = {code: 'w', value: `(FI-MELINDA)${melindaId}`};
  const subfield7 = {code: '7', value: sourceTypeAsCode};

  const subfields = [i, t, g, xz, w, subfield7];
  return [{tag: '773', ind1: '0', ind2: '8', subfields: subfields.filter(sf => sf.value)}];

  function getInternationalStandardNumber() {
    if (sourceType === 'book') {
      return {code: 'z', value: `${isbn}`};
    }
    return {code: 'x', value: `${issn}`};
  }

  function getSubfieldG() {
    const gValue = sourceType === 'book' ? getSubfieldGforBook() : getSubfieldGforJournal();
    return {code: 'g', value: gValue.replace(/^sivu/u, 'Sivu')};
  }

  function getSubfieldGforBook() {
    if (pages.trim().length > 0) {
      return getPages(pages);
    }
    return '';
  }

  function getSubfieldGforJournal() {
    const gvalue = `${getVolume(volume)} ${getPublishingYear(publishingYear)} : ${getNumber(number)}, ${getPages(pages)}`
      .replace(/^[ :,]+/u, '')
      .replace(/ : , /u, ', ') // in the middle
      .replace(/[ :,]+$/u, '' );

    return gvalue;
  }

  function getVolume(volume) {
    if (volume) {
      return volume;
    }
    return '';
  }

  function getPublishingYear(publishingYear) {
    return publishingYear ? `(${publishingYear})` : '';
  }

  function getNumber(number) {
    return number ? number : '';
  }

  function hasOnePage(pages) {
    // If there's just one digit block we assume it's a number (should handle newspaper page numbers such as 'A17'):
    return (/^[^0-9]*[1-9][0-9]*[^0-9]*$/u).test(pages);
  }

  function getPages(pages) {
    if (pages) {
      const quantifier = hasOnePage(pages) ? 'sivu' : 'sivut';
      return `${quantifier} ${pages}`;
    }
    return '';
  }


}

export function generatef787(reviewBooks = [], output = []) {
  const [currBook, ...remainingBooks] = reviewBooks;
  if (!currBook) {
    return output;
  }

  const authors = currBook.authors.filter(author => author.tag && author.tag.charAt(0) === '1'); // Uh, with punctuation on purpose...
  //console.log(`787: GOT ${authors.length} AUTHORS`);
  const aValue = deriveA();

  const [isbn] = currBook.isbns || [''];

  const subfields = [
    {code: 'i', value: 'Arvosteltu teos:'},
    {code: 'a', value: aValue},
    {code: 't', value: `${currBook.title}.`},
    {code: 'd', value: currBook.publishing},
    {code: 'z', value: isbn},
    {code: 'w', value: currBook.melindaId ? `(FI-MELINDA)${currBook.melindaId}` : undefined }
  ];

  const newField = {
    tag: '787', ind1: '0', ind2: '8',
    subfields: subfields.filter(sf => sf.value)
  };



  function deriveA() {
    if (authors.length === 0) {
      return '';
    }
    const name = deriveName();

    if (name === '') {
      return '';
    }
    /* // Not doing "et al." now
    if (authors.length > 1) {
      return `${name} et al.`;
    }
    */

    return `${name}.`;
  }

  function deriveName() {
    if (!authors[0]) {
      return '';
    }
    //console.log(JSON.stringify(authors[0]));
    if (authors[0].type === 'henkilö' && authors[0].lastName && authors[0].firstName) {
      return `${authors[0].lastName}, ${authors[0].firstName}`;
    }
    if (authors[0].type === 'yhteisö' && authors[0].corporateName) {
      return authors[0].corporateName;
    }
    return '';
  }

  return generatef787(remainingBooks, [...output, newField]);
}
