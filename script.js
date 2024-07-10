function hashMap () {
    return {

        storage: new Array(this.capacity),
        size: 0,
        capacity:16,
        loadFactor: 0.75,


        resize: function () {
            this.capacity = this.capacity*2;
            this.storage = new Array(this.capacity);

            let allEntries = this.entries();
            allEntries.forEach((entry) => {
                this.set(entry[0], entry[1])
            })


        },

        hash: function (key) {
            let hashCode = 0;
            const primeNumber = 31;
            const modulus = 2 ** 32 - 1;

            for (let i = 0; i < key.length; i++) {
                hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % modulus;
            }

            return hashCode;
        },
        set: function(key, value) {
            const index = this.hash(key) % this.capacity;

            // Initialize a new linked list if bucket is empty
            if (!this.storage[index]) {
                this.storage[index] = linkedList();
            }

            let bucket = this.storage[index];

            // Check if the key already exists in the linked list
            let node = bucket.head();
            while (node !== null) {
                if (node.value.key === key) {
                    // Update the value if key already exists
                    node.value.value = value;
                    return;
                }
                node = node.link;
            }

            // If key doesn't exist, append a new node to the linked list
            bucket.append({ key: key, value: value });
            this.size++;

            //check the load factor
            if (this.size > this.capacity * this.loadFactor) {
                this.resize();
            }
        },
        get: function (key) {
            const index = this.hash(key) % this.capacity;

            let bucket = this.storage[index];
            if (!bucket) {
                return null; // Return null if bucket is empty (key not found)
            }

            let node = bucket.head();
            while (node !== null) {
                if (node.value.key === key) {
                    return node.value.value; // Return the value if key is found
                }
                node = node.link;
            }

            return null;
        },
        has: function (key) {
            const index = this.hash(key) % this.capacity;

            let bucket = this.storage[index];
            if (!bucket) {
                return false;
            }

            let node = bucket.head();
            while (node !== null) {
                if (node.value.key === key) {
                    return true; // Return the value if key is found
                }
                node = node.link;
            }
            return false;

        },
        remove: function (key) {
            const index = this.hash(key) % this.capacity;

            let bucket = this.storage[index];
            if (!bucket) {
                return false;
            }

            let node = bucket.head();
            while (node !== null) {
                if (node.value.key === key) {
                    //remove matched entry
                    const nodesIndex = bucket.find(node.value);
                    bucket.removeAt(nodesIndex);
                    this.size--;
                    return true; // Return the value if key is found
                }
                node = node.link;
            }

            return false;
        },
        length: function () {
            return this.size;
        },
        clear: function () {
            this.storage = new Array(this.capacity); // Reset storage array
            this.size = 0; // Reset size to 0
        },
        keys: function () {
            let keys = []
            // Iterate through each bucket in the storage array
            this.storage.forEach(bucket => {
                if (bucket) { // Check if the bucket is not empty
                    let currentNode = bucket.head(); // Access the head of the linked list

                    while (currentNode !== null) {
                        keys.push(currentNode.value.key)
                        currentNode = currentNode.link;
                    }
                }
            });
            return keys;
        },
        values: function () {
            let values = [];
            // Iterate through each bucket in the storage array
            this.storage.forEach(bucket => {
                if (bucket) { // Check if the bucket is not empty
                    let currentNode = bucket.head(); // Access the head of the linked list

                    while (currentNode !== null) {
                        values.push(currentNode.value.value)
                        currentNode = currentNode.link;
                    }
                }
            });
            return values;
        },
        entries: function () {
            let entries = [];
            // Iterate through each bucket in the storage array
            this.storage.forEach(bucket => {
                if (bucket) { // Check if the bucket is not empty
                    let currentNode = bucket.head(); // Access the head of the linked list

                    while (currentNode !== null) {
                        entries.push([currentNode.value.key, currentNode.value.value])
                        currentNode = currentNode.link;
                    }
                }
            });
            return entries;
        }
    }
}


// this section for linked list function////////////////////////////////////////////////////////////////////////////

function linkedList () {
    return {
        headNode: null,
        tailNode: null,
        length: 0,



        append: function (value) {
            const newNode = node(value);
            if (this.length === 0) {
                this.headNode = newNode;
                this.tailNode = newNode;
            } else {
                this.tailNode.link = newNode;
                this.tailNode = newNode;
            }
            this.length++;
        },
        prepend: function (value) {
            const newNode = node(value);
            if (this.length === 0) {
                this.headNode = newNode;
                this.tailNode = newNode;
            } else {
                newNode.link = this.headNode;
                this.headNode = newNode;
            }
            this.length++;
        },
        size: function () {
            return this.length;
        },
        head: function () {
            return this.headNode;
        },
        tail: function () {
            return this.tailNode;
        },
        at: function (index) {
            if (index < 0 || index >= this.length) {
                return null;
            }
            let currentIndex = 0;
            let currentNode = this.headNode;

            while (currentIndex < index) {
                currentNode = currentNode.link;
                currentIndex++;
            }
            return currentNode.value;
        },
        pop: function () {

            if (this.length === 0) {
                return null;
            } else if (this.length === 1) {
                // If there's only one node, remove it and reset the list
                this.headNode = null;
                this.tailNode = null;
                this.length = 0;
            } else {
                // Traverse to the second last node
                let currentNode = this.headNode;
                while (currentNode.link !== this.tailNode) {
                    currentNode = currentNode.link;
                }
                // Remove the last node
                currentNode.link = null;
                this.tailNode = currentNode;
                this.length--;
            }
        },
        contains: function(value) {
            let currentNode = this.headNode;
        
            while (currentNode !== null) {
                if (currentNode.value === value) {
                    return true; // Found the value in the list
                }
                currentNode = currentNode.link;
            }
            return false; // Value not found in the list
        },
        find: function(value) {
            let currentNode = this.headNode;
            let currentIndex = 0
            while (currentNode !== null) {
                if (currentNode.value === value) {
                    return currentIndex;
                }
                currentNode = currentNode.link;
                currentIndex++;
            }
            return null;
        },
        toString: function () {
            let currentNode = this.headNode
            let result = ''
            while (currentNode !== null) {
                result += `(${currentNode.value}) -> `;
                currentNode = currentNode.link;
            }
            result += 'null';
            return result;
        },
        removeAt: function (index) {
            if (index < 0 || index >= this.length) {
                return null; // Return null if index is out of bounds
            }
        
            let removedNode;
        
            if (index === 0) {
                // Remove the head node
                removedNode = this.headNode;
                this.headNode = this.headNode.link;
        
                if (this.length === 1) {
                    // If the list had only one node, update the tail node
                    this.tailNode = null;
                }
            } else {
                let previousNode = this.at(index - 1);
        
                removedNode = previousNode.link;
                previousNode.link = removedNode.link;
        
                if (index === this.length - 1) {
                    // If the removed node is the tail node, update the tail node
                    this.tailNode = previousNode;
                }
            }
        
            this.length--;
        }

        }
}


function node (value = null, link = null) {
    return {
        value: value,
        link: link
    }
}



////////test///////

// Create a new instance of hashMap
const test = hashMap();

// Populate the hashMap
test.set('apple', 'red');
test.set('banana', 'yellow');
test.set('carrot', 'orange');
test.set('dog', 'brown');
test.set('elephant', 'gray');
test.set('frog', 'green');
test.set('grape', 'purple');
test.set('hat', 'black');
test.set('ice cream', 'white');
test.set('jacket', 'blue');
test.set('kite', 'pink');
test.set('lion', 'golden');

// Test get method
console.log(test.get('apple'));       // Output: 'red'
console.log(test.get('banana'));      // Output: 'yellow'
console.log(test.get('watermelon'));  // Output: null (not set)

// Test has method
console.log(test.has('carrot'));      // Output: true
console.log(test.has('grape'));       // Output: true
console.log(test.has('watermelon'));  // Output: false

// Test remove method
console.log(test.remove('carrot'));   // Output: true
console.log(test.remove('watermelon'));// Output: false

// Test length method
console.log(test.length());           // Output: 11

// Test keys method
console.log(test.keys());             // Output: ['apple', 'banana', 'dog', 'elephant', 'frog', 'grape', 'hat', 'ice cream', 'jacket', 'kite', 'lion']

// Test values method
console.log(test.values());           // Output: ['red', 'yellow', 'brown', 'gray', 'green', 'purple', 'black', 'white', 'blue', 'pink', 'golden']

// Test entries method
console.log(test.entries());          // Output: [['apple', 'red'], ['banana', 'yellow'], ['dog', 'brown'], ['elephant', 'gray'], ['frog', 'green'], ['grape', 'purple'], ['hat', 'black'], ['ice cream', 'white'], ['jacket', 'blue'], ['kite', 'pink'], ['lion', 'golden']]

// Test clear method
test.clear();
console.log(test.length());           // Output: 0
console.log(test.keys());             // Output: []

// Test resizing and overwriting nodes
test.set('apple', 'green');
test.set('banana', 'orange');
console.log(test.get('apple'));       // Output: 'green'
console.log(test.get('banana'));      // Output: 'orange'
