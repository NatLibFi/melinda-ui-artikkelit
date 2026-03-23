// usage: const uniqValues = [...].filter(onlyUnique);
export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const samiLanguages = ['sma', 'sme', 'smj', 'smn', 'sms']; // Don't add 'smi' here!

export function isSamiLanguage(languageCode) {
  return samiLanguages.includes(languageCode);
}

export function uniqArray(arr) {
  return arr.filter((val, i) => arr.indexOf(val) === i);
}

const lengthInBytes = str => new Blob([str]).size;
//function lengthInBytes(str) {
//  return new Blob([str]).size;
//}

function extractHeadUsingSeparator(str = '', maxLength = 1000, separator = ' ') {
  if ( lengthInBytes(str) <= maxLength) { // Return the whole string without splitting
    return str;
  }

  const chunks = str.split(separator);
  //console.log(`Split string into ${chunks.length} chunk(s) using separator '${separator}'`);
  if ( chunks.length <= 1) { // Failed to chunk: return undefined
    return undefined;
  }

  const lhs = getLeftHandSide('', 0);
  //console.log(` LHS lenght: ${lhs.length}`);
  if (lhs.length === 0) {
    return undefined;
  }

  return lhs;

  function getLeftHandSide(currStr, index) {
    //console.log(`  CURR='${currStr}', I=${index}/${chunks.length}`);
    const currSeparator = chunks.length === index ? '' : separator; 
    const nextStr = `${currStr}${chunks[index]}${separator}`;
    //console.log(`  CAND='${nextStr}`);
    const nextStrLength = lengthInBytes(nextStr);
    if (nextStrLength >= maxLength) {
      // Stop here, as no more words fit
      //console.log(`  STOP (${currStr.length})`);
      return currStr;
    }
    // Try to add next word:
    return getLeftHandSide(nextStr, index+1);
  }

}

function extractHead(str = '', maxLength = 1000) {
  const separators = ['. - ', '. ', '? ', '! ', ' '];

  return innerExtractHeader(separators);
  function innerExtractHeader(separators) {
    const [separator, ...otherSeparators] = separators;
    if (!separator) {
      return str;
    }
    const head = extractHeadUsingSeparator(str, maxLength, separator);
    if (!head || head.length === 0) {
      return innerExtractHeader(otherSeparators);
    }
    return head;
  }

}

export function splitString(str, maxLength, chunks = []) {
  const nextChunk = extractHead(str, maxLength);
  if (nextChunk === str) { // Last chunk: The End
    return [...chunks, str];
  }
  const remainingString = str.substring(nextChunk.length);
  // The caller should remove whitespaces from the end of each chunk.
  return splitString(remainingString, maxLength, [...chunks, nextChunk]);
}

