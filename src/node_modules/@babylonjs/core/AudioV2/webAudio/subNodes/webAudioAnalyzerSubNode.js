import { _AudioAnalyzerSubNode } from "../../abstractAudio/subNodes/audioAnalyzerSubNode.js";
import { _GetEmptyByteFrequencyData, _GetEmptyFloatFrequencyData } from "../../abstractAudio/subProperties/audioAnalyzer.js";
/** @internal */
// eslint-disable-next-line @typescript-eslint/require-await
export async function _CreateAudioAnalyzerSubNodeAsync(engine) {
    return new _WebAudioAnalyzerSubNode(engine);
}
/** @internal */
export class _WebAudioAnalyzerSubNode extends _AudioAnalyzerSubNode {
    /** @internal */
    constructor(engine) {
        super(engine);
        this._byteFrequencyData = null;
        this._floatFrequencyData = null;
        this._analyzerNode = new AnalyserNode(engine._audioContext);
    }
    /** @internal */
    get fftSize() {
        return this._analyzerNode.fftSize;
    }
    set fftSize(value) {
        if (value === this._analyzerNode.fftSize) {
            return;
        }
        this._analyzerNode.fftSize = value;
        this._clearArrays();
    }
    /** @internal */
    get _inNode() {
        return this._analyzerNode;
    }
    /** @internal */
    get minDecibels() {
        return this._analyzerNode.minDecibels;
    }
    set minDecibels(value) {
        this._analyzerNode.minDecibels = value;
    }
    /** @internal */
    get maxDecibels() {
        return this._analyzerNode.maxDecibels;
    }
    set maxDecibels(value) {
        this._analyzerNode.maxDecibels = value;
    }
    /** @internal */
    get smoothing() {
        return this._analyzerNode.smoothingTimeConstant;
    }
    set smoothing(value) {
        this._analyzerNode.smoothingTimeConstant = value;
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._clearArrays();
        this._byteFrequencyData = null;
        this._floatFrequencyData = null;
        this._analyzerNode.disconnect();
    }
    /** @internal */
    getClassName() {
        return "_WebAudioAnalyzerSubNode";
    }
    /** @internal */
    getByteFrequencyData() {
        if (!this._byteFrequencyData || this._byteFrequencyData.length === 0) {
            this._byteFrequencyData = new Uint8Array(this._analyzerNode.frequencyBinCount);
        }
        this._analyzerNode.getByteFrequencyData(this._byteFrequencyData);
        return this._byteFrequencyData;
    }
    /** @internal */
    getFloatFrequencyData() {
        if (!this._floatFrequencyData || this._floatFrequencyData.length === 0) {
            this._floatFrequencyData = new Float32Array(this._analyzerNode.frequencyBinCount);
        }
        this._analyzerNode.getFloatFrequencyData(this._floatFrequencyData);
        return this._floatFrequencyData;
    }
    _clearArrays() {
        this._byteFrequencyData?.set(_GetEmptyByteFrequencyData());
        this._floatFrequencyData?.set(_GetEmptyFloatFrequencyData());
    }
}
//# sourceMappingURL=webAudioAnalyzerSubNode.js.map