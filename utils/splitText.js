function splitText(text, charCount) {
  const res = [];
  // Prep variables to execute split
  let i = 0;
  let contentArray = text.split(" ");
  let parts = Math.ceil(charCount / 4999);
  let start = 0;
  let mid = Math.ceil(contentArray.length / parts);
  let end = mid;
  // Split the text into chunks and return array
  while (i < parts) {
    i++;
    const chunk = contentArray.slice(start, end).join(" ");
    res.push(chunk);
    start = end;
    end += mid;
  }
  return res;
}

module.exports = splitText;
