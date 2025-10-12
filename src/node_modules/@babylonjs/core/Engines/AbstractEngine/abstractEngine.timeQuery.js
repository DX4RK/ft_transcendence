import { AbstractEngine } from "../abstractEngine.js";
import { PerfCounter } from "../../Misc/perfCounter.js";
AbstractEngine.prototype.getGPUFrameTimeCounter = function () {
    if (!this._gpuFrameTime) {
        this._gpuFrameTime = new PerfCounter();
    }
    return this._gpuFrameTime;
};
AbstractEngine.prototype.captureGPUFrameTime = function (value) {
    // Do nothing. Must be implemented by child classes
};
//# sourceMappingURL=abstractEngine.timeQuery.js.map