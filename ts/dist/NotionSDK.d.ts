import { DatabaseEntity } from './entity/DatabaseEntity';
import { PageEntity } from './entity/PageEntity';
export type * from './NotionTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { NotionEntityBase } from './NotionEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class NotionSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Database(entopts?: Record<string, any>): DatabaseEntity;
    Page(entopts?: Record<string, any>): PageEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): NotionSDK;
    tester(testopts?: any, sdkopts?: any): NotionSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof NotionSDK;
export { stdutil, config, BaseFeature, NotionEntityBase, NotionSDK, SDK, };
export type { DirectResult };
