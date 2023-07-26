import iTunesXMLLangURL from '$lib/tree-sitter-iTunesXML.wasm?url';
import TreeSitterWasmURL from '$lib/tree-sitter.wasm?url';
import Parser from 'web-tree-sitter';
import { base64 } from 'rfc4648';
import type { dataPackage, song } from '$lib/util/zod';
import { z } from 'zod';

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
	const rootDict = tree.rootNode.namedChild(2)?.namedChild(0);
	const rootDictCursor = rootDict?.walk();
	if (!rootDictCursor) {
		throw "Couldn't find root dict";
	}
	rootDictCursor.gotoFirstChild();

	const dateField = getFieldInDict(rootDictCursor, 'Date');
	if (dateField == null) {
		throw "Couldn't find date";
	}
	const date = getAndParseKeyDate(dateField);

	const tracksDict = getFieldInDict(rootDictCursor, 'Tracks');
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
							name = getAndParseKeyString(dataNode);
							break;
						case 'Artist':
							artist = getAndParseKeyString(dataNode);
							break;
						case 'Album':
							album = getAndParseKeyString(dataNode);
							break;
						case 'Genre':
							genre = getAndParseKeyString(dataNode);
							break;
						case 'Total Time':
							time = getAndParseKeyNumber(dataNode);
							break;
						case 'Play Count':
							playCount = getAndParseKeyNumber(dataNode);
							break;
						case 'Skip Count':
							skipCount = getAndParseKeyNumber(dataNode);
							break;
						case 'Rating':
							rating = getAndParseKeyNumber(dataNode);
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

function getAndParseKeyString(node: Parser.SyntaxNode): string {
	const dataNode = node.namedChild(0);
	if (!dataNode) {
		throw 'data node not found';
	}
	return xmlUnescape(dataNode.text);
}

function getAndParseKeyNumber(node: Parser.SyntaxNode): number {
	const dataNode = node.namedChild(0);
	if (!dataNode) {
		throw 'data node not found';
	}
	return parseInt(dataNode.text);
}

function getAndParseKeyDate(node: Parser.SyntaxNode): Date {
	const dataNode = node.namedChild(0);
	if (!dataNode) {
		throw 'data node not found';
	}
	return new Date(dataNode.text);
}

function getAndParseKeyBinary(node: Parser.SyntaxNode): Uint8Array {
	const dataNode = node.namedChild(0);
	if (!dataNode) {
		throw 'data node not found';
	}
	return base64.parse(dataNode.text);
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
