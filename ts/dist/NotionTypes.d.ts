export interface Database {
    created_time?: string;
    id?: string;
    last_edited_time?: string;
    object?: string;
    parent?: Record<string, any>;
    properties?: Record<string, any>;
    title?: any[];
}
export interface DatabaseLoadMatch {
    id: string;
}
export interface DatabaseCreateData {
    created_time?: string;
    id?: string;
    last_edited_time?: string;
    object?: string;
    parent?: Record<string, any>;
    properties?: Record<string, any>;
    title?: any[];
}
export interface DatabaseUpdateData {
    id: string;
    created_time?: string;
    last_edited_time?: string;
    object?: string;
    parent?: Record<string, any>;
    properties?: Record<string, any>;
    title?: any[];
}
export interface Page {
    archived?: boolean;
    created_time?: string;
    id?: string;
    last_edited_time?: string;
    object?: string;
    parent?: Record<string, any>;
    properties?: Record<string, any>;
}
export interface PageLoadMatch {
    id: string;
}
export interface PageCreateData {
    archived?: boolean;
    created_time?: string;
    id?: string;
    last_edited_time?: string;
    object?: string;
    parent?: Record<string, any>;
    properties?: Record<string, any>;
}
export interface PageUpdateData {
    id: string;
    archived?: boolean;
    created_time?: string;
    last_edited_time?: string;
    object?: string;
    parent?: Record<string, any>;
    properties?: Record<string, any>;
}
