import Reader from './Reader';

type tag = {
	opening?: boolean | undefined;
	tagName: string;
	attributes?: Map<string, string | boolean> | undefined;
};

export default class TokenReader {
	dataReader: Reader;

	constructor(data: ArrayBuffer) {
		this.dataReader = new Reader(data);
	}

	read(): tag | string {
		this.skipWhitespace();
		let char = this.dataReader.peek();
		if (char == '<') {
			this.dataReader.read();
			return this.readTag();
		} else {
			return this.readContent();
		}
	}

	private readContent() {
		const content = [];
		let char = this.dataReader.peek();
		while (char != '<') {
			content.push(char);
			this.dataReader.skip();
			char = this.dataReader.peek();
			if (char == '&') {
				let escape = [];
				while (char != ';') {
					escape.push(char);
					this.dataReader.skip();
					char = this.dataReader.peek();
				}
			}
		}
		return content.join('');
	}

	private readAttrName() {
		let word = [];
		let char = this.dataReader.peek();
		let code = char.charCodeAt(0);
		while (!((code >= 33 && code <= 44) || (code >= 58 && code <= 63) || code == 47)) {
			this.dataReader.read();
			word.push(char);
			char = this.dataReader.peek();
			code = char.charCodeAt(0);
		}
		return word.join('');
	}

	private readAttrValue() {
		const value = [];
		let char = this.dataReader.read();
		if (char == '"') {
			char = this.dataReader.read();
			value.push(char);
			while (true) {
				char = this.dataReader.read();
				if (char != '"') {
					value.push(char);
				} else {
					break;
				}
			}
		} else {
			throw 'unexpected token ' + this.currentCharNum();
		}
		return value.join('');
	}

	private readTagName() {
		const tagName = [];
		let char = this.dataReader.peek();
		while (!(char == ' ' || char == '>' || char == '/')) {
			tagName.push(char);
			this.dataReader.skip();
			char = this.dataReader.peek();
		}
		return tagName.join('');
	}

	private skipWhitespace() {
		while (true) {
			let code = this.dataReader.peek().charCodeAt(0);
			if (code == 32 || code == 10 || code == 9) {
				this.dataReader.read();
			} else {
				break;
			}
		}
	}

	private currentCharNum() {
		return this.dataReader.pos;
	}

	private readTag(): tag {
		let closing: boolean = false;
		let selfClosing: boolean = false;
		let attributes: Map<string, string | boolean> | undefined;
		if (this.dataReader.peek() == '/') {
			this.dataReader.read();
			closing = true;
		}
		let tagName = this.readTagName();
		this.skipWhitespace();

		if (tagName == '!DOCTYPE') {
			let char = this.dataReader.peek();
			while (char != '<') {
				this.dataReader.skip();
				char = this.dataReader.peek();
			}
			return { tagName: '!DOCTYPE' };
		}

		if (!closing) {
			while (
				!(
					this.dataReader.peek() == '/' ||
					this.dataReader.peek() == '>' ||
					this.dataReader.peek() == '?'
				)
			) {
				attributes = new Map();
				let attrName = this.readAttrName();
				let attrVal: string | boolean;
				if (this.dataReader.read() == '=') {
					attrVal = this.readAttrValue();
				} else {
					attrVal = true;
				}
				attributes.set(attrName, attrVal);
				this.skipWhitespace();
			}

			if (this.dataReader.peek() == '/') {
				this.dataReader.read();
				selfClosing = true;
			}
			if (this.dataReader.peek() == '?') {
				this.dataReader.read();
			}
		}

		const test = this.dataReader.read();
		if (!(test == '>')) {
			throw 'unclosed tag at ' + this.currentCharNum() + ' "' + test + '"';
		}

		if (closing) {
			return { opening: false, tagName: tagName };
		} else if (selfClosing) {
			return { opening: false, tagName: tagName, attributes: attributes };
		} else {
			return { opening: true, tagName: tagName, attributes: attributes };
		}
	}
}
