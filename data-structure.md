## Array vs List

Array
Memory Layout: Arrays use contiguous memory. All elements are stored next to each other in physical memory.
Access: Elements can be accessed in constant time (O(1)) using an index because their positions are determined mathematically (e.g., starting address + index × element size).
Fixed Size: The size of an array is typically fixed at creation. Resizing often involves creating a new array and copying elements.
Type: In many programming languages, arrays are homogeneous, meaning all elements must be of the same type (e.g., integers, strings).
List
Memory Layout: Lists (e.g., linked lists or abstract data types like Python's list) may not use contiguous memory. Instead, they use logical connections between elements, which might involve pointers or references.
For linked lists: Each element (node) contains data and a reference to the next (or previous) node.
For dynamic arrays (like Python's list): They often use a contiguous block of memory but dynamically resize when needed.
Access: Access time depends on the type of list:
For linked lists: Access is linear (O(n)) since you may need to traverse nodes to find a specific element.
For dynamic arrays: Access remains constant time (O(1)) for indexing, but resizing can cause performance overhead.
Flexibility: Lists are generally more flexible than arrays. They can grow or shrink dynamically without requiring a predefined size.
Type: Lists are often heterogeneous, meaning they can hold elements of different types.
