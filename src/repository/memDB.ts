import { KeyValue, KeyValueDB, KeyValueDBManager } from "../core/keyValueDB";
import { Service } from "typedi";

@Service()
export class MemDBManager implements KeyValueDBManager {
  private readonly memdb: Map<string, MemDB> = new Map<string, MemDB>();

  async get(uuid: string): Promise<KeyValueDB> {
    if (this.memdb.has(uuid)) {
      return this.memdb.get(uuid)!;
    }
    const newMemdb = new MemDB();
    this.memdb.set(uuid, newMemdb);
    return newMemdb;
  }
}

export class MemDB implements KeyValueDB {
  private readonly _storage: Map<string, string> = new Map<string, string>();

  async has(key: string): Promise<boolean> {
    return this._storage.has(key);
  }

  async read(key: string): Promise<string> {
    return this._storage.get(key) || "";
  }

  async keyValues(): Promise<Array<KeyValue>> {
    return Array.from(this._storage.entries()).map((e) => ({
      key: e[0],
      value: e[1],
    }));
  }

  async count(): Promise<number> {
    return this._storage.size;
  }

  async create(key: string, value: string) {
    this._storage.set(key, value);
  }

  async update(key: string, value: string) {
    this._storage.set(key, value);
  }

  async delete(key: string) {
    this._storage.delete(key);
  }
}
