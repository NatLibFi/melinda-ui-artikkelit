import assert from 'node:assert';
import {READERS} from '@natlibfi/fixura';
import generateTests from '@natlibfi/fixugen';
import {genericTest} from './specUtils.mjs';
import {generatef506, generatef520, generatef540, generatef567, generatef591, generatef598, generatef599} from '../src/services/recordServices/marcRecordServiceUtils/generate5xxFields.js';

generateTests({
  callback: testF500,
  path: [import.meta.dirname, '.', 'testFixtures','generatef500'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF500({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await genericTest(input, /^500$/u);

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
  callback: testF506,
  path: [import.meta.dirname, '.', 'testFixtures','generatef506'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF506({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef506(input.article.link, input.source.isElectronic);

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
  callback: testF520,
  path: [import.meta.dirname, '.', 'testFixtures','generatef520'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF520({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef520(input.abstracts);

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
  callback: testF540,
  path: [import.meta.dirname, '.', 'testFixtures','generatef540'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF540({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef540(input.article);

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
  callback: testF567,
  path: [import.meta.dirname, '.', 'testFixtures','generatef567'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF567({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef567(input.metodologys);

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
  callback: testF591,
  path: [import.meta.dirname, '.', 'testFixtures','generatef591'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF591({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef591(input.sciences, input.article.type);

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
  callback: testF598,
  path: [import.meta.dirname, '.', 'testFixtures','generatef598'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF598({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const result = await generatef598(input.collecting.f589a);

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
  callback: testF599,
  path: [import.meta.dirname, '.', 'testFixtures','generatef599'],
  useMetadataFile: true,
  recurse: false,
  fixura: {
    reader: READERS.JSON
  }
});

async function testF599({getFixture, expectToFail = false}) {
  try {
    const input = getFixture('input.json');
    const expectedResults = getFixture('output.json');
    const {f599a, f599x} = input.collecting;
    const result = await generatef599(f599a, f599x);

    assert.deepEqual(result, expectedResults);
    assert.equal(expectToFail, false, 'This is expected to succeed');

  } catch (error) {
    if (!expectToFail) {
      throw error;
    }

    assert.equal(expectToFail, true, 'This is expected to fail');
  }
}


