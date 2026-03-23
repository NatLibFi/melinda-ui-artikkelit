import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
//import {generatef100sf110sf700sf710s} from '../src/services/recordServices/marcRecordServiceUtils/generate1xxFields.js';
import {genericTest} from './specUtils.mjs';

generateTests({
  callback: testF100etc,
  path: [import.meta.dirname, '.', 'testFixtures','generatef100'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF100etc({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await genericTest(input, /^[17][01]0$/u);
    //const result = await generatef100sf110sf700sf710s(input.authors);

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    assert.equal(expectToFail, true, 'This is expected to fail');
  }
}
