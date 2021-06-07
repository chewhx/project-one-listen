class File {
  constructor(url) {
    this.url = new URL(url);
    this.sourceUrl = url;
    this.metadata = {
      title: "",
      slug: "",
      excerpt: "",
      wordCount: 0,
      charCount: 0,
    };
    this.filePath = null;
    this.fileName = this.url.pathname.split(".")[0].split("/").join("-");
    this.fileLink = null;
    this.user = null;
    this.status = "Processing";
    this.id = null;
    this.queue = "Parser";
    this.next = null;
  }

  mongo() {
    return {
      sourceUrl: this.sourceUrl,
      metadata: this.metadata,
      filePath: this.filePath,
      fileName: this.fileName,
      fileLink: this.fileLink,
      status: this.status,
      user: this.user,
      queue: this.queue,
    };
  }
}

module.exports = File;
