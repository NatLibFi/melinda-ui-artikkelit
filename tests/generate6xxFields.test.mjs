import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
import {generatef655reviews} from '../src/services/recordServices/marcRecordServiceUtils/generate6xxFields.js';
import {genericTest} from './specUtils.mjs';

generateTests({
  callback: testF6xx,
  path: [import.meta.dirname, '.', 'testFixtures','generatef6xx'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF6xx({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await genericTest(input, /^6..$/u);

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
  callback: testF655B,
  path: [import.meta.dirname, '.', 'testFixtures','generatef655B'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF655B({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef655reviews(input.reviews);

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    assert.equal(expectToFail, true, 'This is expected to fail');
  }
}
