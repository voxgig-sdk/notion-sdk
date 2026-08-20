import { NotionEntityBase } from '../NotionEntityBase';
import type { NotionSDK } from '../NotionSDK';
import type { Control } from '../types';
import type { Page, PageLoadMatch, PageCreateData, PageUpdateData } from '../NotionTypes';
declare class PageEntity extends NotionEntityBase<Page> {
    constructor(client: NotionSDK, entopts: any);
    make(this: PageEntity): PageEntity;
    load(this: any, reqmatch?: PageLoadMatch, ctrl?: Control): Promise<PageEntity>;
    create(this: any, reqdata?: PageCreateData, ctrl?: Control): Promise<PageEntity>;
    update(this: any, reqdata?: PageUpdateData, ctrl?: Control): Promise<PageEntity>;
}
export { PageEntity };
