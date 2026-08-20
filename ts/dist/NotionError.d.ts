import { Context } from './Context';
declare class NotionError extends Error {
    isNotionError: boolean;
    sdk: string;
    code: string;
    ctx: Context;
    status: number;
    get notFound(): boolean;
    constructor(code: string, msg: string, ctx: Context);
}
export { NotionError };
