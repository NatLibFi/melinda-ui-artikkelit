import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
//import {generatef041, generatef080, generatef084} from '../src/services/recordServices/marcRecordServiceUtils/generate0xxFields.js';
import {genericTest} from './specUtils.mjs';

generateTests({
  callback: testF041,
  path: [import.meta.dirname, '.', 'testFixtures','generatef041'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF041({getFixture}) {
  const input = getFixture('input.json');
  const expectedResults = getFixture('output.json');
  //const result = await generatef041(input.articleLanguage, input.abstractLanguages);
  const result = await genericTest(input, /^041$/u);

  assert.deepEqual(result, expectedResults);
}

generateTests({
  callback: testF080,
  path: [import.meta.dirname, '.', 'testFixtures','generatef080'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF080({getFixture}) {
  const input = getFixture('input.json');
  const expectedResults = getFixture('output.json');
  //const result = await generatef080(input.udks);
  const result = await genericTest(input, /^080$/u);

  assert.deepEqual(result, expectedResults);
}

generateTests({
  callback: testF084,
  path: [import.meta.dirname, '.', 'testFixtures','generatef084'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF084({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    //const result = await generatef084(input.otherRatings);
    const result = await genericTest(input, /^084$/u);

    assert.deepEqual(result, expectedResults);
    // expect(expectToFail, 'This is expected to succes').to.equal(false);
    assert.equal(expectToFail, false, 'This is expected to succeed');
   

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    // expect(expectToFail, 'This is expected to fail').to.equal(true);
    assert.equal(expectToFail, true, 'This is expected to fail');

  }
}
