class Node {
  constructor() {
    this.file = null;
    this.length = null;
  }

  push(file) {
    if (this.length === 1) {
      return undefined;
    }
    if (!this.length) {
      this.file = file;
      this.length = 1;
      return true;
    }
  }

  pop() {
    if (this.length === 1) {
      this.file = null;
      this.length = null;
      return true;
    }
    if (!this.length) {
      return undefined;
    }
  }
}

module.exports = Node;
