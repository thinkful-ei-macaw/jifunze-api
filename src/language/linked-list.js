class _Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }

      tempNode.next = new _Node(item, null);
    }
  }

  insertAfter(item, newItem) {
    let currNode = this.find(item);
    if (currNode === null) return;
    
    currNode.next = new _Node(newItem, currNode.next);
  }

  find(item) {
    let currNode = this.head;

    if (!this.head) {
      return null;
    }

    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      }
      else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  findByPosition(position) {
    let currNode = this.head;
    let counter = 0;

    if (!this.head) return null;
    
    while (counter < position) {
      if (currNode.next === null) return null;
      currNode = currNode.next;
      counter++;
    }

    return currNode;
  }

  remove(item) {
    if (!this.head) {
      return null;
    }
    
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }

    let currNode = this.head;
    let previousNode = this.head;

    while ((currNode !== null) && (currNode.value !== item)) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    
    if (currNode === null) return;
    previousNode.next = currNode.next;
  }
}

module.exports = LinkedList;