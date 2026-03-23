import {generatef005, generatef007, generatef008, generateLeader} from './marcRecordServiceUtils/generateControlFields.js';
import {generatef040, generatef041, generatef080, generatef084} from './marcRecordServiceUtils/generate0xxFields.js';
import {generatef100sf110sf700sf710s} from './marcRecordServiceUtils/generate1xxFields.js';
import {generatef245, generatef246} from './marcRecordServiceUtils/generate2xxFields.js';
import {generatef490} from './marcRecordServiceUtils/generate4xxFields.js';
import {generatef500, generatef506, generatef520, generatef540, generatef567, generatef591, generatef598, generatef599} from './marcRecordServiceUtils/generate5xxFields.js';
import {generatef6xxs, generatef655reviews} from './marcRecordServiceUtils/generate6xxFields.js';
import {generatef773, generatef787} from './marcRecordServiceUtils/generate7xxFields.js';
import {generatef856} from './marcRecordServiceUtils/generate8xxFields.js';
import {generatef960} from './marcRecordServiceUtils/generate9xxFields.js';

import {MarcRecord} from '@natlibfi/marc-record';
import {AddMissingField336, AddMissingField337, IndicatorFixes, MergeFields, NormalizeUTF8Diacritics, Punctuation2, RemoveDuplicateDataFields, SortFields} from '@natlibfi/marc-record-validators-melinda';

export function createMarcRecordService(useMoment = 'now') {

  return {generateRecord};

  function getLanguageFor008(articleLanguageCode, journalLanguageCode) {
    if (articleLanguageCode && !['|||'].includes(articleLanguageCode)) {
      return articleLanguageCode;
    }
    if (journalLanguageCode) {
      return journalLanguageCode;
    }
    return 'fin';
  }

  function generateRecord(data) {
    //console.log(data); // eslint-disable-line

    const {source, journalNumber, abstracts, article, authors, ontologyWords, notes, udks, otherRatings, otherTitles, collecting, sciences, methodologies, reviews} = data;
    //console.log(collecting);
    const titleFor773t = source ? source.title : undefined;
    const {isElectronic} = source ? source : {};
    const {isbn, issn, melindaId} = parseIncomingData(source);
    const {language: articleLanguage, title: articleTitle, subtitle: articleSubtitle, statementOfResponsibility: articleStatementOfResponsibility} = article ? article : {};
    const referenceLinks = article ? article.link : undefined; // field 856
    const sourceTypeAsCode = source ? source.sourceType : undefined; // eg. 'nnas', 'nnam' for field 773
    const sourceTypeAsText = getSourceTypeAsText(source) || 'journal'; // journal, book, text, electronic
    const abstractLanguages = abstracts ? abstracts.map(elem => elem.language.iso6392b) : [];
    // const today = new Date();
    // const year = today.getFullYear(); // journal year form value / book year form value / current year form value
    // const journalJufo = 'todo'; //https://wiki.eduuni.fi/display/cscvirtajtp/Jufo-tunnistus
    const {f598a, f599a, f599x} = collecting ? collecting : {};

    const articleLanguageCode = articleLanguage && !['|||'].includes(articleLanguage.iso6392b) ? articleLanguage.iso6392b : undefined;
    const finalLanguageCode = getLanguageFor008(articleLanguageCode, source ? source.journalLanguage : undefined);

    const journalCountry = source && source.journalCountry ? source.journalCountry : 'fi ';

    //console.info(`SOURCE YEARS: ${source.years ? source.years : 'N/A'}`);
    //console.info(`JOURNAL YEARS: ${journalNumber  ? journalNumber.publishingYear : 'N/A'}`);

    const record = {
      leader: generateLeader(sourceTypeAsText),
      fields: [
        generatef005(),
        generatef007(isElectronic),
        generatef008(useMoment, journalNumber && journalNumber.publishingYear ? journalNumber.publishingYear : source?.years, journalCountry, sourceTypeAsText, isElectronic, finalLanguageCode),
        generatef040(),
        generatef041(finalLanguageCode, abstractLanguages),
        generatef080(udks), // (UDK lisäkentät)
        generatef084(otherRatings), // (lisäkentät)
        generatef100sf110sf700sf710s(authors),
        generatef245(articleTitle, articleSubtitle, articleStatementOfResponsibility, authors, finalLanguageCode),
        generatef246(otherTitles),
        generatef490(article ? article.sectionOrColumn : undefined),
        generatef500(notes), // general notes
        generatef506(referenceLinks, isElectronic),
        generatef520(abstracts), // Abstracts
        generatef540(article),
        generatef567(methodologies),
        generatef591(sciences, article ? article.type : undefined),
        generatef598(f598a),
        generatef599(f599a, f599x),
        generatef6xxs(ontologyWords),
        generatef655reviews(reviews),
        generatef773(sourceTypeAsText, journalNumber ? journalNumber : {}, melindaId, isbn, issn, sourceTypeAsCode, titleFor773t),
        generatef787(reviews), // review books
        generatef856(referenceLinks, isElectronic),
        generatef960()
      ].flat()
    };

    const marcRecord = new MarcRecord(record, {subfieldValues: false});

    // I'm skipping validate step here (first this was supposed to be just one or two validators):
    AddMissingField336().fix(marcRecord);
    AddMissingField337().fix(marcRecord);
    IndicatorFixes().fix(marcRecord);
    NormalizeUTF8Diacritics().fix(marcRecord);
    Punctuation2().fix(marcRecord);
    //EndingPunctuation().fix(marcRecord); // This generates dots the globals way, so we get too many ending punctuation dots in terms (national convention)
    RemoveDuplicateDataFields().fix(marcRecord); // Don't add same yso term twice
    SortFields().fix(marcRecord);
    MergeFields().fix(marcRecord);

    return marcRecord;
  }

}

export function parseIncomingData(data) {
  if (!data) {
    return { isbn: [''], issn: [''], melindaId: undefined };
  }
  const [isbn] = data.isbns || [''];
  const [issn] = data.issns || [''];
  const melindaId = data.melindaId;

  return {
    isbn,
    issn,
    melindaId
  };
}

export function getSourceTypeAsText(input) {
  if (!input) {
    return undefined;
  }
  const found = input.sourceType;
  const get3rd = found.substr(2, 1);
  const get4th = found.substr(3, 1);

  if (get4th === 's' || get4th === 'i') {
    return 'journal';
  }

  if (get4th === 'm' || get4th === 'c') {
    return 'book';
  }

  if (get3rd === 'a') {
    return 'text';
  }

  if (get3rd === 'g' || get3rd === 'i' || get3rd === 'm') {
    return 'electronic';
  }

}
