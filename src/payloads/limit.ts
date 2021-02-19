import { IsPositive, Min } from "class-validator";

export class LimitQuery {
  @Min(0)
  offset: number = 0;

  @IsPositive()
  limit: number = 50;
}
