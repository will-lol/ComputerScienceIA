import iTunesXMLLangURL from '../lib/tree-sitter-iTunesXML.wasm?url';
import TreeSitterWasmURL from '../lib/tree-sitter.wasm?url';
import Parser from 'web-tree-sitter';

onmessage = async (e) => {
	const message = e.data as string;
    console.log("hi");
	postMessage(await parse(message));
};

async function parse(string: string) {
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
    console.log(tree.rootNode.child(2)?.children);
	return "returned";
}
