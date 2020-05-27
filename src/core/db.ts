export interface DbStat {
  keyValue: Graph;
  create: Graph;
  update: Graph;
}

interface Graph {
  id: string;
  x: number[];
  y: (number | undefined)[];
}

export class Db {
  private static _createTime: Map<number, number> = new Map<number, number>();
  private static _updateTime: Map<number, number> = new Map<number, number>();
  private static _keyValuesTime: Map<number, number> = new Map<
    number,
    number
  >();

  public static addCreateTime(time: number) {
    Db._createTime.set(Date.now(), time);
  }

  public static addUpdateTime(time: number) {
    Db._updateTime.set(Date.now(), time);
  }

  public static addKeyValuesTime(time: number) {
    Db._keyValuesTime.set(Date.now(), time);
  }

  public static getStat(): DbStat {
    return {
      keyValue: Db.getLast20values("keyValue", Db._keyValuesTime),
      create: Db.getLast20values("create", Db._createTime),
      update: Db.getLast20values("update", Db._updateTime),
    };
  }

  private static getLast20values(id: string, o: Map<number, number>): Graph {
    const x = Array.from(o.keys()).sort().slice(0, 20) || [];
    const y = x.map((x) => o.get(x)) || [];
    return { id, x, y };
  }
}
