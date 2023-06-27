export default class BinarySearchTree<T> {
	private root: Node<T> | null;
	//a comparator should return a positive integer if one > two, negative if one < two, 0 if one == two
	private comparator: (one: T, two: T) => number;
	private size: number = 0;

	constructor(comparator: (one: T, two: T) => number) {
		this.root = null;
		this.comparator = comparator;
	}

	getRoot() {
		return this.root;
	}

	getSize() {
		return this.size;
	}

	getComparator() {
		return this.comparator;
	}

	insert(data: T): void {
		const newNode = new Node(data, this.size);
		if (this.root == null) {
			this.root = newNode;
			this.size++;
			return;
		}

		let currentNode = this.root;
		while (true) {
			if (this.comparator(newNode.data, currentNode.data) >= 0) {
				if (currentNode.right == null) {
					newNode.parent = currentNode;
					currentNode.right = newNode;
					break;
				} else {
					currentNode = currentNode.right;
				}
			} else {
				if (currentNode.left == null) {
					newNode.parent = currentNode;
					currentNode.left = newNode;
					break;
				} else {
					currentNode = currentNode.left;
				}
			}
		}
		this.size++;
	}

	search(query: T): T | undefined {
		if (this.root == null) {
			return undefined;
		}
		let currentNode = this.root;
		while (true) {
			const comparison = this.comparator(query, currentNode.data);
			if (comparison == 0) {
				return currentNode.data;
			}
			if (comparison > 0) {
				if (currentNode.right == null) {
					return undefined;
				}
				currentNode = currentNode.right;
			} else {
				if (currentNode.left == null) {
					return undefined;
				}
				currentNode = currentNode.left;
			}
		}
	}

	inOrderTraverse(amount: number): T[] {
		const array: T[] = new Array(amount);
		const isVisited: boolean[] = new Array(this.size);
		if (amount > this.size) {
			throw 'amount must not exceed size';
		}
		if (this.root == null) {
			throw 'traverse only operates on non-empty tree';
		}
		let currentNode = this.root;
		let num = 0;

		while (num != amount) {
			//Adding logic
			if (
				(currentNode.left == null || //left node is null
					(currentNode.left != null && isVisited[currentNode.left.id])) && //or left node is visited
				!isVisited[currentNode.id] //and current node isnt visited
			) {
				//if current node is lowest that hasn't been visited:
				array[num] = currentNode.data; //add to array
				isVisited[currentNode.id] = true; //set to visited
				num++; //incrememnt num
			}

			//Moving logic
			if (currentNode.left != null && !isVisited[currentNode.left.id]) {
				//if left and left not visited
				currentNode = currentNode.left; //go left!
			} else if (
				currentNode.parent != null && //parent and parent not visited and no right node or right node visited
				!isVisited[currentNode.parent.id] &&
				(currentNode.right == null || isVisited[currentNode.right.id])
			) {
				currentNode = currentNode.parent; //go parent!
			} else if (currentNode.right != null && !isVisited[currentNode.right.id]) {
				//if right and right not visited
				currentNode = currentNode.right; //go right!
			} else if (currentNode.parent) {
				//if parent
				currentNode = currentNode.parent; //go parent!
			}
		}

		return array;
	}

	from(array: T[]) {
		for (const item of array) {
			this.insert(item);
		}
	}

	copyTo(newTree: BinarySearchTree<T>) {
		const prevNodeWithRightStack: Node<T>[] = [];
		let num = 0;
		if (this.root == null) {
			return;
		}
		let currentNode: Node<T> = this.root;
		while (num != this.size) {
			if (currentNode.right != null) {
				prevNodeWithRightStack.push(currentNode);
			}
			newTree.insert(currentNode.data);
			if (currentNode.left) {
				currentNode = currentNode.left;
			} else {
				const lastNodeWithRight = prevNodeWithRightStack.pop();
				if (lastNodeWithRight == undefined) {
					return;
				}
				currentNode = lastNodeWithRight.right!;
			}
		}
	}
}

export class Node<T> {
	left: Node<T> | null;
	right: Node<T> | null;
	parent: Node<T> | null;
	id: number;
	data: T;

	constructor(data: T, id: number) {
		this.data = data;
		this.id = id;
		this.left = null;
		this.right = null;
		this.parent = null;
	}
}
