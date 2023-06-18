import type BinarySearchTree from "./binarySearchTree";
import type {Node} from "./binarySearchTree";

export default class InOrderTreeCursor<T> {
    private binaryTree: BinarySearchTree<T>;
    private root: Node<T>;
    private isVisited: boolean[];
    private currentIndex: number;
    private currentNode: Node<T>;

    constructor(binaryTree: BinarySearchTree<T>) {
        this.binaryTree = binaryTree;
        const root = binaryTree.getRoot();
        if (root == null) {
            throw "cursor only works on non-empty tree"
        }
        this.root = root;
        this.isVisited = new Array(binaryTree.getSize());
        this.currentIndex = 0;
        this.currentNode = this.root;
    }

    next(): T {
		if (this.currentIndex > this.binaryTree.getSize()) {
			throw 'out of tree bounds';
		}

        let output: T | undefined = undefined;

		while (output == undefined) {
			//adding logic
			if (
				(this.currentNode.left == null ||
					(this.currentNode.left != null && this.isVisited[this.currentNode.left?.id])) &&
				!this.isVisited[this.currentNode.id]
			) {
				output = this.currentNode.data;
				this.isVisited[this.currentNode.id] = true;
				this.currentIndex++;
			}

			//moving logic
			if (this.currentNode.left != null && !this.isVisited[this.currentNode.left.id]) {
				this.currentNode = this.currentNode.left;
			} else if (this.currentNode.parent != null &&
				!this.isVisited[this.currentNode.parent.id] &&
				(this.currentNode.right == null || this.isVisited[this.currentNode.right.id])
			) {
				this.currentNode = this.currentNode.parent;
			} else if (this.currentNode.right != null && !this.isVisited[this.currentNode.right.id]) {
				this.currentNode = this.currentNode.right;
			} else if (this.currentNode.parent) {
				this.currentNode = this.currentNode.parent;
			}
		}

		return output;
    }

}