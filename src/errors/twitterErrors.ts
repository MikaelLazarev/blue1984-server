import {InternalServerError} from "routing-controllers";

export class IncorrectTwitterResponse extends InternalServerError {
    constructor() {
        super(`Incorrect twitter response`);
    }
}


