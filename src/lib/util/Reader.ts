export default class Reader {
    data: Uint8Array;
    pos: number = 0;
    constructor(buffer: ArrayBuffer) {
        this.data = new Uint8Array(buffer);
    }

    endOfFile() {
        return this.data[this.pos+1] == undefined
    }

    read() {
        const output = String.fromCharCode(this.data[this.pos]);
        this.pos++;
        return output;
    }

    skip() {
        this.pos++;
    }

    peek() {
        return String.fromCharCode(this.data[this.pos]);
    }
}