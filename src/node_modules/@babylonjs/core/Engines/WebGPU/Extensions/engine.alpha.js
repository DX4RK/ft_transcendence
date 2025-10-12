import { AbstractEngine } from "../../abstractEngine.js";

import "../../AbstractEngine/abstractEngine.alpha.js";
import { ThinWebGPUEngine } from "../../thinWebGPUEngine.js";
ThinWebGPUEngine.prototype.setAlphaMode = function (mode, noDepthWriteChange = false, targetIndex = 0) {
    const alphaBlend = this._alphaState._alphaBlend[targetIndex];
    if (this._alphaMode[targetIndex] === mode && ((mode === 0 && !alphaBlend) || (mode !== 0 && alphaBlend))) {
        if (!noDepthWriteChange) {
            // Make sure we still have the correct depth mask according to the alpha mode (a transparent material could have forced writting to the depth buffer, for instance)
            const depthMask = mode === 0;
            if (this.depthCullingState.depthMask !== depthMask) {
                this.setDepthWrite(depthMask);
                this._cacheRenderPipeline.setDepthWriteEnabled(depthMask);
            }
        }
        return;
    }
    const alphaBlendDisabled = mode === 0;
    this._alphaState.setAlphaBlend(!alphaBlendDisabled, targetIndex);
    this._alphaState.setAlphaMode(mode, targetIndex);
    if (!noDepthWriteChange) {
        this.setDepthWrite(alphaBlendDisabled);
        this._cacheRenderPipeline.setDepthWriteEnabled(alphaBlendDisabled);
    }
    this._alphaMode[targetIndex] = mode;
    this._cacheRenderPipeline.setAlphaBlendEnabled(this._alphaState._alphaBlend, this._alphaState._numTargetEnabled);
    this._cacheRenderPipeline.setAlphaBlendFactors(this._alphaState._blendFunctionParameters, this._alphaState._blendEquationParameters);
};
ThinWebGPUEngine.prototype.setAlphaEquation = function (equation, targetIndex = 0) {
    AbstractEngine.prototype.setAlphaEquation.call(this, equation, targetIndex);
    this._cacheRenderPipeline.setAlphaBlendFactors(this._alphaState._blendFunctionParameters, this._alphaState._blendEquationParameters);
};
//# sourceMappingURL=engine.alpha.js.map