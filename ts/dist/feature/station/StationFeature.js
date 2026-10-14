"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationFeature = void 0;
const BaseFeature_1 = require("../base/BaseFeature");
const station_1 = require("@voxgig/station");
class StationFeature extends BaseFeature_1.BaseFeature {
    version = '0.0.1';
    name = 'station';
    active = true;
    _binding = null;
    init(ctx, options) {
        this._binding = (0, station_1.featureBinding)(ctx, options);
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