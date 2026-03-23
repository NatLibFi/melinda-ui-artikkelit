import {organizations} from "../../../scripts/constants/organizations.mjs";
import {generateAsteriBaseField} from "./generate6xxFields.js";

// NB! Loading organizations does not work in tests, so tests fail to create $g properly!

export function generatef100sf110sf700sf710s(authors = []) {

  if (!authors || authors.length === 0) {
    return [];
  }

  // First kirjoittaja goes to field 1X0:
  const mainAuthorIndex = authors.findIndex(author => author.relator === 'kirjoittaja');

  const authorFields = authors.map((author, index) => {
    const isMainAuthor = index === mainAuthorIndex;
    if (author.type === 'FIN11' ) {
      const term = author.asteriAuthor;
      const hundred = isMainAuthor ? '1' : '7';
      const [baseField] = generateAsteriBaseField(term, hundred);
      //console.log(JSON.stringify(baseField));
      const subfield0 = baseField.subfields.filter(sf => sf.code === '0');
      const otherSubfields = baseField.subfields.filter(sf => sf.code !== '0');
      const subE = createSubfieldE(term.tag);
      const subU = generateOrganizations();
      const subG = generateOrgnCodes();
      const subfields2 = [...otherSubfields, subE, subU, subG, ...subfield0]; //.filter(sf => sf);
      baseField.subfields = subfields2.filter(sf => sf.value && sf.value !== '');
      return baseField;
    }

    const firstNameSplitted = author.firstName.split(' ');
    const [firstPart] = firstNameSplitted;


 

    if (isMainAuthor) {
      return generate100or110();
    }

    return generate700or710();

    function generate100or110() {
      if (author.firstName === ' ' && author.lastName === ' ') {
        return []; // hit space key on both means: 'skip this', we don't want a 1XX field
      }

      if (author.firstName === '' && author.lastName === '' && author.corporateName === '') {
        return []; // no data entered
      }

      return {
        tag: author.type === 'yhteisö' ? '110' : '100',
        ind1: ind1Value(),
        ind2: ' ',
        subfields: generateSubfields()
      };

    }

    function generate700or710() {
      return {
        tag: author.type === 'yhteisö' ? '710' : '700',
        ind1: ind1Value(),
        ind2: ' ',
        subfields: generateSubfields()
      };
    }

    function ind1Value() {

      if (firstPart === 'c' && firstNameSplitted.length > 1) { // title case
        return '0';
      }

      if (author.type === 'henkilö' && author.firstName === '' && author.lastName.length > 0) { // one name case
        return '0';
      }

      if (author.type === 'yhteisö' && author.corporateName.length > 0) { // yhteiso
        return '2';
      }

      return '1';
    }

    function checkCaseType() {
      if (author.type === 'yhteisö') {
        return false;
      }
      // checking: is it title-case ( = c+title) or onlyOneName-case ( = empty entered as first name)
      // 'etunimi'-field in both cases is essential. First entered character there is crucial.

      if (author.firstName === '' && author.lastName.length > 0) { // case: only one name entered
        return 'oneNameCase';
      }

      if (firstPart === 'c' && firstNameSplitted.length > 1) { // case: title entered
        return 'titleCase';
      }

      return false;
    }

    function generateSubfields() { // 100 & 700
      const subA = createSubfieldA();
      const subC = createSubfieldC();
      const subE = createSubfieldE();
      const subU = generateOrganizations();
      const subG = generateOrgnCodes();

      //console.info(`${JSON.stringify([subA, subC, subE, subU, subG])}`);

      return [subA, subC, subE, subU, subG].filter(sf => sf.value && sf.value !== '');
    }

    function createSubfieldA() {
      if (author.type === 'yhteisö') {
        return {code: 'a', value: `${author.corporateName}.`};
      }

      if (checkCaseType()) {
        return {code: 'a', value: `${author.lastName},`}; // used only with C-subfield (title case)
      }

      return {code: 'a', value: `${author.lastName}, ${author.firstName},`};
    }

    function createSubfieldC() {
      if (checkCaseType() === 'titleCase') {
        const theTitle = `${author.firstName.slice(2)},`
        return {code: 'c', value: theTitle};
      }
      return {code: 'c', value: ''};
    }

    function createSubfieldE(tag = '100') {
      const code = tag === '111' ? 'j': 'e';
      if (!author.relator) {
        return {code, value: ''};
      }
      return {code, value: `${author.relator}.`};
    }

    function generateOrganizations() {
      if (author.type === 'yhteisö' || !author.authorsOrganization) {
        return {code: 'u', value: ''};
      }
      return {code: 'u', value: author.authorsOrganization};
      /*
      const mapOrgnNames = author.authorsTempOrganizations.map(elem => `${elem.organizationName}`);
      if (mapOrgnNames.length === 0) {
        return {code: 'u', value: ''};
      }
      const editOrgnNames = mapOrgnNames.toString().replaceAll(',', ' ; ');
      return {code: 'u', value: `${editOrgnNames}`};
      */
    }

    function generateOrgnCodes() {
      if (author.type === 'yhteisö' || !author.authorsOrganization) {
        return {code: 'u', value: ''};
      }
      const organizationName = author.authorsOrganization;

      const entry = organizations.find(org => org.value === organizationName);
      // console.info(`ORGN: ${JSON.stringify(entry)}`);
      return {code: 'g', value: entry && entry.code ? `(orgn)${entry.code}` :''};
      /*
      const code = author.authorsTempOrganizations.map(elem => `${elem.code}`).filter(val => val.length > 0);
      const editCodes = code.toString().replaceAll(',', ' ');
      if (editCodes.length === 0) {
        return {code: 'g', value: ''};
      }

      return {code: 'g', value: `(orgn)${editCodes}`};
      */
    }

  });

  // Our original less-than-brill code sometimes returns [] instead of data. Filter that noise out here:
  return authorFields.filter(f => f.subfields);
}
