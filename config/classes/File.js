class File {
  constructor(url) {
    this.url = new URL(url);
    this.sourceUrl = url;
    this.filePath = null;
    this.fileName = this.url.pathname.split(".")[0].split("/").join("-");
    this.fileLink = null;
    this.user = null;
    this.status = "Processing";
    this.next = null;
    this.id = null;
  }
}

module.exports = File;
