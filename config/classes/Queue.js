class Queue {
  constructor(name) {
    console.log(`${name} queue init`);
    this.head = null;
    this.tail = null;
    this.length = null;
  }

  enqueue(node) {
    if (!this.head) {
      this.head = node;
      this.length++;
      return true;
    }
    if (!this.tail) {
      this.head.next = node;
      this.tail = node;
      this.length++;
      return true;
    }
    this.tail.next = node;
    this.tail = node;
    this.length++;
    return true;
  }

  dequeue() {
    if (!this.head) {
      return false;
    }
    let removed = this.head;
    this.head = removed.next;
    this.length--;
    removed.next = null;
    if (!this.head) {
      this.tail = null;
    }
    return removed;
  }
}

module.exports = Queue;
