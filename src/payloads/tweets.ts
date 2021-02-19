import { Tweet } from "../core/tweet";
import {LimitQuery} from "./limit";

export class FeedQuery extends LimitQuery {
  showDeleted?: boolean
}

export class TweetsListDTO {
  data: Tweet[];
  meta?: {
    next?: number;
  };

  constructor(data: Tweet[], next?: number) {
    this.data = data;
    this.meta = {
      next,
    };
  }
}
