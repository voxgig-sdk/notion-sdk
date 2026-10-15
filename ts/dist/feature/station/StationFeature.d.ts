import type { Context, FeatureOptions } from '../../types';
import { BaseFeature } from '../base/BaseFeature';
import type { featureBinding } from '@voxgig/station';
declare class StationFeature extends BaseFeature {
    version: string;
    name: string;
    active: boolean;
    _binding: ReturnType<typeof featureBinding>;
    init(ctx: Context, options: FeatureOptions): void | Promise<any>;
    PrePoint(this: any, ctx: any): void;
    PreDone(this: any, ctx: any): void;
    PreUnexpected(this: any, ctx: any): void;
}
export { StationFeature };
