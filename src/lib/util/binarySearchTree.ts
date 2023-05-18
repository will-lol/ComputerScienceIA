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

	search(query: T): { success: boolean; data?: T } {
		if (this.root == null) {
			return { success: false };
		}
		let currentNode = this.root;
		while (true) {
			const comparison = this.comparator(query, currentNode.data);
			if (comparison == 0) {
				return { success: true, data: currentNode.data };
			}
			if (comparison > 0) {
				if (currentNode.right == null) {
					return { success: false };
				}
				currentNode = currentNode.right;
			} else {
				if (currentNode.left == null) {
					return { success: false };
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
			if (
				(currentNode.left == null ||
					(currentNode.left != null && isVisited[currentNode.left?.id])) &&
				!isVisited[currentNode.id]
			) {
				array[num] = currentNode.data;
				isVisited[currentNode.id] = true;
				num++;
			}

			if (currentNode.left != null && !isVisited[currentNode.left.id]) {
				currentNode = currentNode.left;
			} else if (
				currentNode.parent != null &&
				!isVisited[currentNode.parent.id] &&
				(currentNode.right == null || isVisited[currentNode.right.id])
			) {
				currentNode = currentNode.parent;
			} else if (currentNode.right != null && !isVisited[currentNode.right.id]) {
				currentNode = currentNode.right;
			} else if (currentNode.parent) {
				currentNode = currentNode.parent;
			}
		}

		return array;
	}
}

class Node<T> {
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