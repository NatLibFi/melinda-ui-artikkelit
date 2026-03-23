import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
import {generatef856} from '../src/services/recordServices/marcRecordServiceUtils/generate8xxFields.js';

generateTests({
  callback: testF856,
  path: [import.meta.dirname, '.', 'testFixtures','generatef856'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF856({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef856(input.article.link, input.source.isElectronic);

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    assert.equal(expectToFail, true, 'This is expected to fail');
  }

}
