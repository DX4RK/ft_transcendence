
import { Logger } from "../../Misc/logger.js";
/** @internal */
export class WebGPUSnapshotRendering {
    constructor(engine, renderingMode, bundleList) {
        this._record = false;
        this._play = false;
        this._playBundleListIndex = 0;
        this._allBundleLists = [];
        this._enabled = false;
        this.showDebugLogs = false;
        this._engine = engine;
        this._mode = renderingMode;
        this._bundleList = bundleList;
    }
    get enabled() {
        return this._enabled;
    }
    get play() {
        return this._play;
    }
    get record() {
        return this._record;
    }
    set enabled(activate) {
        this._log("enabled", `activate=${activate}, mode=${this._mode}`);
        this._allBundleLists.length = 0;
        this._record = this._enabled = activate;
        this._play = false;
        if (activate) {
            this._modeSaved = this._mode;
            this._mode = 0; // need to reset to standard for the recording pass to avoid some code being bypassed
        }
    }
    get mode() {
        return this._mode;
    }
    set mode(mode) {
        if (this._record) {
            this._modeSaved = mode;
        }
        else {
            this._mode = mode;
        }
    }
    endRenderPass(currentRenderPass) {
        if (!this._record && !this._play) {
            // Snapshot rendering mode is not enabled
            return false;
        }
        let bundleList = null;
        if (this._record) {
            bundleList = this._bundleList.clone();
            this._allBundleLists.push(bundleList);
            this._bundleList.reset();
            this._log("endRenderPass", `bundleList recorded at position #${this._allBundleLists.length - 1}`);
        }
        else {
            // We are playing the snapshot
            if (this._playBundleListIndex >= this._allBundleLists.length) {
                this._log("endRenderPass", `empty or out-of-sync bundleList (_allBundleLists.length=${this._allBundleLists.length}, playBundleListIndex=${this._playBundleListIndex})`);
            }
            else {
                this._log("endRenderPass", `run bundleList #${this._playBundleListIndex}`);
                bundleList = this._allBundleLists[this._playBundleListIndex++];
            }
        }
        if (bundleList) {
            bundleList.run(currentRenderPass);
            if (this._mode === 1) {
                this._engine._reportDrawCall(bundleList.numDrawCalls);
            }
        }
        return true;
    }
    endFrame() {
        if (this._record) {
            // We stop recording and switch to replay mode for the next frames
            this._record = false;
            this._play = true;
            this._mode = this._modeSaved;
            this._log("endFrame", "bundles recorded, switching to play mode");
        }
        this._playBundleListIndex = 0;
    }
    reset() {
        this._log("reset", "called");
        if (this._record) {
            this._mode = this._modeSaved;
        }
        this.enabled = false;
        this.enabled = true;
    }
    _log(funcName, message) {
        if (this.showDebugLogs) {
            Logger.Log(`[Frame: ${this._engine.frameId}] WebGPUSnapshotRendering:${funcName} - ${message}`);
        }
    }
}
//# sourceMappingURL=webgpuSnapshotRendering.js.map