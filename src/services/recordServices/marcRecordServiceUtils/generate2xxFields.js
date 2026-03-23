export function generatef245(articleTitle, articleSubtitle, articleStatementOfResponsibility, authors, artLang) {

  if (!articleTitle) {
    return [];
  }

  // NB! Punctuation is added by validators/fixers!
  const subfieldA = {code: 'a', value: articleTitle};
  const subfieldB = articleSubtitle ? [{code: 'b', value: articleSubtitle}] : [];
  const subfieldC = articleStatementOfResponsibility ? [{code: 'c', value: articleStatementOfResponsibility}] : [];

  return [
    {
      tag: '245', ind1: ' ', ind2: ' ', // Validator/fixer indicator-fixes.js adds proper values to these indicators
      subfields: [subfieldA, ...subfieldB, ...subfieldC]
    }
  ];

}

export function generatef246(otherTitles = []) {
  //<xsl:if test="set/elements/element[@name='title_other']">
  // <datafield tag="246" ind1="3" ind2=" ">
  //  <subfield code="a">
  //   <xsl:value-of select="set/elements/element[@name='title_other']/values[1]/value" />
  //  </subfield>
  // </datafield>
  //</xsl:if>
  return otherTitles.map(otherTitle => ({tag: '246', ind1: '3', ind2: '0', subfields: [{code: 'a', value: otherTitle.value}]}));
}
