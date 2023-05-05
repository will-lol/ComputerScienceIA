import TokenReader from "./TokenReader";

export default class Parser {
    tokenReader: TokenReader;

    constructor(data: ArrayBuffer) {
        this.tokenReader = new TokenReader(data);
        
    }
}