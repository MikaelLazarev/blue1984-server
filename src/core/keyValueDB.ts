export interface KeyValue {
    key: string,
    value: string
}

export interface KeyValueDBManager {
    get(uuid: string) : Promise<KeyValueDB>
}

export interface KeyValueDB {
    has(key: string) : Promise<boolean>
    read(key: string): Promise<string>;
    keyValues() : Promise<Array<KeyValue>>
    count(): Promise<number>;
    create(key: string, value: string): Promise<void>;
    update(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}
