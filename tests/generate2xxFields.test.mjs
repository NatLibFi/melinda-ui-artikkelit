import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
import {genericTest} from './specUtils.mjs';

generateTests({
  callback: testF245,
  path: [import.meta.dirname, '.', 'testFixtures','generatef245'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF245({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await genericTest(input, /^2..$/u);
    //const result = await generatef245(input.article.title, input.authors, input.article.language.iso6392b);

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    assert.equal(expectToFail, true, 'This is expected to fail');
  }
}
