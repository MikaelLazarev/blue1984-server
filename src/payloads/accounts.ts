import {IsArray, IsNotEmpty} from "class-validator";

export class AccountCreateDTO {
  @IsNotEmpty()
  id: string;
}

export class AccountListDTO {
  //@IsDecimal()
  @IsArray()
  accounts: string[];
}

