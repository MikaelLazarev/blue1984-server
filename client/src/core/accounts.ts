import {Tweet} from "../../../src/core/tweet";

export interface Account {
  id: string;
  bluID: string;
  tweets?: Tweet[];
}

