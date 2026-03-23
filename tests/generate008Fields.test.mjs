import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
//import {generatef008} from '../src/services/recordServices/marcRecordServiceUtils/generateControlFields.js';
//import {getSourceTypeAsText} from '../src/services/recordServices/marcRecordService.js';
import { genericTest } from './specUtils.mjs';

generateTests({
  callback: testF008,
  path: [import.meta.dirname, '.', 'testFixtures','generatef008'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});
async function testF008({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await genericTest(input, /^008$/u);
    //const result = await generatef008('Jun 14th 23', input.journalNumber.publishingYear, getSourceTypeAsText(input.source), input.source.isElectronic, input.article.language);
    result[0].value = result[0].value.replace(/^....../u, '000101');

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }
    assert.equal(expectToFail, true, 'This is expected to fail');
  }
}
