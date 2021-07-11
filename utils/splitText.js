module.exports = (text, charPerChunk) => {
  if (!text || !charPerChunk) return undefined;

  // Get number of characters in text
  const textCharLen = text.length;

  // Get number of parts text can be split into, based on given characters per chunk
  const parts = textCharLen / charPerChunk;

  // Create an array of words from text, split by spacing
  const textArray = text.split(" ");

  // Get number of words in array
  const textArrayLen = textArray.length;

  // Get index point to splice array of words
  const endIndex = Math.ceil(textArrayLen / parts);

  // Result object to return
  const results = [];

  // While text array has words, splice it and push to results object
  while (textArray.length > 0) {
    results.push(textArray.splice(0, endIndex).join(" "));
  }

  return results;
};

// function splitText(text, charCount) {
//   const res = [];
//   // Prep variables to execute split
//   let i = 0;
//   let contentArray = text.split(" ");
//   let parts = Math.ceil(charCount / 4999);
//   let start = 0;
//   let mid = Math.ceil(contentArray.length / parts);
//   let end = mid;
//   // Split the text into chunks and return array
//   while (i < parts) {
//     i++;
//     const chunk = contentArray.slice(start, end).join(" ");
//     res.push(chunk);
//     start = end;
//     end += mid;
//   }
//   return res;
// }

// module.exports = splitText;
