import { NotionEntityBase } from '../NotionEntityBase';
import type { NotionSDK } from '../NotionSDK';
import type { Control } from '../types';
import type { Database, DatabaseLoadMatch, DatabaseCreateData, DatabaseUpdateData } from '../NotionTypes';
declare class DatabaseEntity extends NotionEntityBase<Database> {
    constructor(client: NotionSDK, entopts: any);
    make(this: DatabaseEntity): DatabaseEntity;
    load(this: any, reqmatch?: DatabaseLoadMatch, ctrl?: Control): Promise<DatabaseEntity>;
    create(this: any, reqdata?: DatabaseCreateData, ctrl?: Control): Promise<DatabaseEntity>;
    update(this: any, reqdata?: DatabaseUpdateData, ctrl?: Control): Promise<DatabaseEntity>;
}
export { DatabaseEntity };
