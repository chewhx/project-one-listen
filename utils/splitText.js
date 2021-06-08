// Prep variables to execute split
let i = 0;
let contentArray = res.content.split(" ");
let parts = Math.ceil(res.char_count / 4999);
let start = 0;
let mid = Math.ceil(contentArray.length / parts);
let end = mid;

// Split the text into chunks and save as individual plain text files
while (i < parts) {
  i++;
  const chunk = contentArray.slice(start, end).join(" ");
  fs.writeFileSync(
    `${parserDirPath}/${file.metadata.slug}/${file.metadata.slug}-part${i}.txt`,
    JSON.stringify(chunk)
  );
  start = end;
  end += mid;
}
