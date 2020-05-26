import {Tweet} from "./tweet";

export interface Account {
  id: string;
  bluID: string;
}

export interface AccountFull {
  id: string;
  bluID: string;
  tweets: Tweet[];
}



export interface AccountCreateDTO {
  id: string;
}

export const accountCreateDTOSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
    },
  },
};

export interface AccountListDTO {
  accounts: string[];
}

export const accountListDTOSchema = {
  type: "object",
  required: ["accounts"],
  properties: {
    accounts: {
      type: "array",
      items: {
        type: "string",
      }
    },
  },
};


export interface AccountsRepositoryI {
  create(id: string): Promise<Account | undefined>;
  findOne(id: string): Promise<Account | undefined>
  list(): Promise<Account[] | undefined>;
}

export interface AccountsServiceI {
  create(dto: AccountCreateDTO): Promise<Account | undefined>;
  list(dto: AccountListDTO): Promise<Account[] | undefined>;
  retrieve(id: string): Promise<AccountFull>;
  startUpdate() : void;
  stopUpdate() : void
}
