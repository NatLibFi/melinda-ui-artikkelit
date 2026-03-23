export function generatef856(referenceLinks, isElectronic) {
  if (!referenceLinks || referenceLinks.length === 0 ) {
    return [];
  }

  function ind2value(isElectronic) {
    if (isElectronic === false) { // printed
      return '1';
    }
    return '0'; // electronic
  }

  const realLinks = referenceLinks.filter(f => f.length > 0);

  return realLinks.map(link => ({
    tag: '856',
    ind1: '4',
    ind2: ind2value(isElectronic),
    subfields: [{code: 'u', value: link}, {code: 'y', value: 'Linkki verkkoaineistoon'}]
  }));
}
