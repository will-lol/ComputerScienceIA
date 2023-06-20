import iTunesXMLLangURL from '$lib/tree-sitter-iTunesXML.wasm?url';
import TreeSitterWasmURL from '$lib/tree-sitter.wasm?url';
import Parser from 'web-tree-sitter';
import { base64 } from 'rfc4648';
import type { dataPackage, song } from '$lib/util/zod';

addEventListener('error', (e) => {
	throw e;
});

onmessage = (e) => {
	const message = e.data as string;
	parse(message)
		.then((res) => postMessage(res))
		.catch((err) => {
			postMessage({ error: err });
		});
};

function xmlUnescape(string: string): string {
	return string.replaceAll(/\&.*?\;/g, (match: string) => {
		switch (match) {
			case '&#60;':
				return '<';
			case '&lt':
				return '<';
			case '&#38;':
				return '&';
			case '&#62;':
				return '>';
			case '&gt;':
				return '>';
			case '&#39;':
				return "'";
			case '&#34;':
				return '"';
		}
		return match;
	});
}

async function parse(string: string): Promise<dataPackage> {
	await Parser.init({
		locateFile() {
			return TreeSitterWasmURL;
		}
	});
	const iTunesXMLLang = await Parser.Language.load(iTunesXMLLangURL);
	const iTunesXMLParser = new Parser();
	iTunesXMLParser.setLanguage(iTunesXMLLang);
	const iTunesXML = string;
	const tree = iTunesXMLParser.parse(iTunesXML);
	const dict = tree.rootNode.namedChild(2)?.namedChild(0);
	const dictCursor = dict?.walk();
	if (!dictCursor) {
		throw "Couldn't find root dict";
	}

	dictCursor.gotoFirstChild();
	const dateField = getFieldInDict(dictCursor, 'Date');
	if (dateField == null) {
		throw "Couldn't find date";
	}
	const date = getAndParseKeyValue<Date>(dateField);

	const tracksDict = getFieldInDict(dictCursor, 'Tracks');
	if (tracksDict == null) {
		throw "Couldn't find tracks";
	}
	const songs = tracksDict
		.descendantsOfType('obj')
		.slice(1)
		.map((item): song => {
			let name: string | undefined,
				artist: string | undefined,
				album: string | undefined,
				genre: string | undefined;
			let time: number | undefined,
				playCount: number | undefined,
				skipCount: number | undefined,
				rating: number | undefined;

			const cursor = item.walk();
			cursor.gotoFirstChild();
			while (cursor.gotoNextSibling()) {
				if (cursor.nodeType == 'item') {
					const key = cursor.currentNode().namedChild(0);
					if (key == null) {
						throw 'no key in item';
					}
					const keyName = getKeyName(key);

					const dataNode = key.nextSibling;
					if (dataNode == null) {
						throw 'no data node in item';
					}
					switch (keyName) {
						case 'Name':
							name = getAndParseKeyValue<string>(dataNode);
							break;
						case 'Artist':
							artist = getAndParseKeyValue<string>(dataNode);
							break;
						case 'Album':
							album = getAndParseKeyValue<string>(dataNode);
							break;
						case 'Genre':
							genre = getAndParseKeyValue<string>(dataNode);
							break;
						case 'Total Time':
							time = getAndParseKeyValue<number>(dataNode);
							break;
						case 'Play Count':
							playCount = getAndParseKeyValue<number>(dataNode);
							break;
						case 'Skip Count':
							skipCount = getAndParseKeyValue<number>(dataNode);
							break;
						case 'Rating':
							rating = getAndParseKeyValue<number>(dataNode);
							break;
					}
				}
			}
			return {
				name: name,
				artist: artist,
				album: album,
				genre: genre,
				time: time,
				playCount: playCount,
				skipCount: skipCount,
				rating: rating
			};
		});

	return { metadata: { date: date }, songs: songs };
}

function getAndParseKeyValue<T>(node: Parser.SyntaxNode): T {
	const dataNode = node.namedChild(0);
	if (!dataNode) {
		throw 'data node not found';
	}
	if (dataNode.type == 'text') {
		return xmlUnescape(dataNode.text) as T;
	} else if (dataNode.type == 'float' || dataNode.type == 'int') {
		return parseInt(dataNode.text) as T;
	} else if (dataNode.type == 'base64') {
		return base64.parse(dataNode.text) as T;
	} else if (dataNode.type == 'iso8601') {
		return new Date(dataNode.text) as T;
	} else {
		throw 'unexpected type';
	}
}

function getKeyName(node: Parser.SyntaxNode) {
	const dataNode = node.namedChild(0);
	if (dataNode?.text) {
		return dataNode.text;
	}
}

function getFieldInDict(cursor: Parser.TreeCursor, field: string): Parser.SyntaxNode | null {
	while (true) {
		if (cursor.nodeType == 'item') {
			cursor.gotoFirstChild();
			if (cursor.nodeType == 'key') {
				const keyVal = getKeyName(cursor.currentNode());
				if (keyVal != null && keyVal == field) {
					if (cursor.gotoNextSibling()) {
						const output = cursor.currentNode();
						cursor.gotoParent();
						return output;
					}
				}
			}
			cursor.gotoParent();
		}
		const goto = cursor.gotoNextSibling();
		if (!goto) {
			break;
		}
	}
	return null;
}
