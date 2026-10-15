"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationFeature = void 0;
const BaseFeature_1 = require("../base/BaseFeature");
class StationFeature extends BaseFeature_1.BaseFeature {
    version = '0.0.1';
    name = 'station';
    active = true;
    _binding = null;
    // Loaded here rather than at module load: init runs only for an active
    // feature, so an SDK that is never bound loads without station installed.
    init(ctx, options) {
        const station = require('@voxgig/station');
        this._binding = station.featureBinding(ctx, options);
    }
    PrePoint(ctx) {
        if (null != this._binding) {
            this._binding.PrePoint(ctx);
        }
    }
    PreDone(ctx) {
        if (null != this._binding) {
            this._binding.PreDone(ctx);
        }
    }
    PreUnexpected(ctx) {
        if (null != this._binding) {
            this._binding.PreUnexpected(ctx);
        }
    }
}
exports.StationFeature = StationFeature;
//# sourceMappingURL=StationFeature.js.map