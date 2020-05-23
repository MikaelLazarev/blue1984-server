export interface Account {
  id: string;
  bluID: string;
}

export interface AccountCreateDTO {
  name: string;
}

export const accountCreateDTOSchema = {
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string",
    },
  },
};

export interface AccountsRepositoryI {
  create(id: string): Promise<void>;
  findOne(id: string): Promise<Account | undefined>
  list(): Promise<Account[] | undefined>;
}

export interface AccountsServiceI {
  create(dto: AccountCreateDTO): Promise<Account>;
  list(): Promise<Account[] | undefined>;
}
