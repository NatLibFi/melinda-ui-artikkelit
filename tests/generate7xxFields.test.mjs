import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
import {generatef773, generatef787} from '../src/services/recordServices/marcRecordServiceUtils/generate7xxFields.js';
import {getSourceTypeAsText, parseIncomingData} from '../src/services/recordServices/marcRecordService.js';

generateTests({
  callback: testF773,
  path: [import.meta.dirname, '.', 'testFixtures','generatef773'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF773({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');

    const {issn, melindaId} = parseIncomingData(input.source);
    const isbn = '951-isbn';
    const {publishingYear, volume, number, pages} = input.journalNumber;
    const result = await generatef773(getSourceTypeAsText(input.source), {publishingYear, volume, number, pages}, melindaId, isbn, issn, input.source.sourceType, input.source.title);

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    assert.equal(expectToFail, true, 'This is expected to fail');
  }
}

generateTests({
  callback: testF787,
  path: [import.meta.dirname, '.', 'testFixtures','generatef787'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF787({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef787(input.reviews);

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    assert.equal(expectToFail, true, 'This is expected to fail');
  }
}
