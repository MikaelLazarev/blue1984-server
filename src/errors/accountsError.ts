import {NotFoundError} from "routing-controllers";

export class AccountDoesntExistError extends NotFoundError {
    constructor(account: string) {
        super(`${account} doesn't exists`);
    }
}
