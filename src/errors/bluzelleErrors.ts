import {InternalServerError} from "routing-controllers";

export class WrongMnemonicError extends InternalServerError {
    constructor(mnemonic: string) {
        super(`Wrong mnemonic: ${mnemonic} `);
    }
}



export class BluzelleInternalError extends InternalServerError {
    constructor() {
        super(`Bluzelle Internal error`);
    }
}
