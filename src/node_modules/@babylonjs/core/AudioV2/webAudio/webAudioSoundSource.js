import { AbstractSoundSource } from "../abstractAudio/abstractSoundSource.js";
import { _HasSpatialAudioOptions } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { _SpatialWebAudio } from "./subProperties/spatialWebAudio.js";
/** @internal */
export class _WebAudioSoundSource extends AbstractSoundSource {
    /** @internal */
    constructor(name, webAudioNode, engine, options) {
        super(name, engine);
        this._spatial = null;
        this._spatialAutoUpdate = true;
        this._spatialMinUpdateTime = 0;
        this._stereo = null;
        if (typeof options.spatialAutoUpdate === "boolean") {
            this._spatialAutoUpdate = options.spatialAutoUpdate;
        }
        if (typeof options.spatialMinUpdateTime === "number") {
            this._spatialMinUpdateTime = options.spatialMinUpdateTime;
        }
        this._audioContext = this.engine._audioContext;
        this._webAudioNode = webAudioNode;
        this._subGraph = new _WebAudioSoundSource._SubGraph(this);
    }
    /** @internal */
    async _initAsync(options) {
        if (options.outBus) {
            this.outBus = options.outBus;
        }
        else if (options.outBusAutoDefault !== false) {
            await this.engine.isReadyPromise;
            this.outBus = this.engine.defaultMainBus;
        }
        await this._subGraph.initAsync(options);
        if (_HasSpatialAudioOptions(options)) {
            this._initSpatialProperty();
        }
        this.engine._addNode(this);
    }
    /** @internal */
    get _inNode() {
        return this._webAudioNode;
    }
    /** @internal */
    get _outNode() {
        return this._subGraph._outNode;
    }
    /** @internal */
    get spatial() {
        if (this._spatial) {
            return this._spatial;
        }
        return this._initSpatialProperty();
    }
    /** @internal */
    get stereo() {
        return this._stereo ?? (this._stereo = new _StereoAudio(this._subGraph));
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._spatial?.dispose();
        this._spatial = null;
        this._stereo = null;
        this._subGraph.dispose();
        this.engine._removeNode(this);
    }
    /** @internal */
    getClassName() {
        return "_WebAudioSoundSource";
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the subgraph.
        if (node._inNode) {
            this._outNode?.connect(node._inNode);
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node._inNode) {
            this._outNode?.disconnect(node._inNode);
        }
        return true;
    }
    _initSpatialProperty() {
        if (!this._spatial) {
            this._spatial = new _SpatialWebAudio(this._subGraph, this._spatialAutoUpdate, this._spatialMinUpdateTime);
        }
        return this._spatial;
    }
}
_WebAudioSoundSource._SubGraph = class extends _WebAudioBusAndSoundSubGraph {
    get _downstreamNodes() {
        return this._owner._downstreamNodes ?? null;
    }
    get _upstreamNodes() {
        return this._owner._upstreamNodes ?? null;
    }
    _onSubNodesChanged() {
        super._onSubNodesChanged();
        this._owner._inNode.disconnect();
        if (this._owner._subGraph._inNode) {
            this._owner._inNode.connect(this._owner._subGraph._inNode);
        }
    }
};
//# sourceMappingURL=webAudioSoundSource.js.map