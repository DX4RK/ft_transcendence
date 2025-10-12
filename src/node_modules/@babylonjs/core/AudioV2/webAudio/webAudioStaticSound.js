import { StaticSound } from "../abstractAudio/staticSound.js";
import { StaticSoundBuffer } from "../abstractAudio/staticSoundBuffer.js";
import { _StaticSoundInstance } from "../abstractAudio/staticSoundInstance.js";
import { _HasSpatialAudioOptions } from "../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _CleanUrl, _FileExtensionRegex } from "../audioUtils.js";
import { _WebAudioParameterComponent } from "./components/webAudioParameterComponent.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import { _SpatialWebAudio } from "./subProperties/spatialWebAudio.js";
/** @internal */
export class _WebAudioStaticSound extends StaticSound {
    /** @internal */
    constructor(name, engine, options) {
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
        this._options = {
            autoplay: options.autoplay ?? false,
            duration: options.duration ?? 0,
            loop: options.loop ?? false,
            loopEnd: options.loopEnd ?? 0,
            loopStart: options.loopStart ?? 0,
            maxInstances: options.maxInstances ?? Infinity,
            pitch: options.pitch ?? 0,
            playbackRate: options.playbackRate ?? 1,
            startOffset: options.startOffset ?? 0,
        };
        this._subGraph = new _WebAudioStaticSound._SubGraph(this);
    }
    /** @internal */
    async _initAsync(source, options) {
        this._audioContext = this.engine._audioContext;
        if (source instanceof _WebAudioStaticSoundBuffer) {
            this._buffer = source;
        }
        else if (typeof source === "string" || Array.isArray(source) || source instanceof ArrayBuffer || source instanceof AudioBuffer) {
            this._buffer = (await this.engine.createSoundBufferAsync(source, options));
        }
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
        if (options.autoplay) {
            this.play();
        }
        this.engine._addNode(this);
    }
    /** @internal */
    get buffer() {
        return this._buffer;
    }
    /** @internal */
    get _inNode() {
        return this._subGraph._inNode;
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
    async cloneAsync(options = null) {
        const clone = await this.engine.createSoundAsync(this.name, options?.cloneBuffer ? this.buffer.clone() : this.buffer, this._options);
        clone.outBus = options?.outBus ? options.outBus : this.outBus;
        return clone;
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
        return "_WebAudioStaticSound";
    }
    _createInstance() {
        return new _WebAudioStaticSoundInstance(this, this._options);
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
_WebAudioStaticSound._SubGraph = class extends _WebAudioBusAndSoundSubGraph {
    get _downstreamNodes() {
        return this._owner._downstreamNodes ?? null;
    }
    get _upstreamNodes() {
        return this._owner._upstreamNodes ?? null;
    }
};
/** @internal */
export class _WebAudioStaticSoundBuffer extends StaticSoundBuffer {
    /** @internal */
    constructor(engine) {
        super(engine);
    }
    async _initAsync(source, options) {
        if (source instanceof AudioBuffer) {
            this._audioBuffer = source;
        }
        else if (typeof source === "string") {
            await this._initFromUrlAsync(source);
        }
        else if (Array.isArray(source)) {
            await this._initFromUrlsAsync(source, options.skipCodecCheck ?? false);
        }
        else if (source instanceof ArrayBuffer) {
            await this._initFromArrayBufferAsync(source);
        }
    }
    /** @internal */
    get channelCount() {
        return this._audioBuffer.numberOfChannels;
    }
    /** @internal */
    get duration() {
        return this._audioBuffer.duration;
    }
    /** @internal */
    get length() {
        return this._audioBuffer.length;
    }
    /** @internal */
    get sampleRate() {
        return this._audioBuffer.sampleRate;
    }
    /** @internal */
    clone(options = null) {
        const audioBuffer = new AudioBuffer({
            length: this._audioBuffer.length,
            numberOfChannels: this._audioBuffer.numberOfChannels,
            sampleRate: this._audioBuffer.sampleRate,
        });
        for (let i = 0; i < this._audioBuffer.numberOfChannels; i++) {
            audioBuffer.copyToChannel(this._audioBuffer.getChannelData(i), i);
        }
        const buffer = new _WebAudioStaticSoundBuffer(this.engine);
        buffer._audioBuffer = audioBuffer;
        buffer.name = options?.name ? options.name : this.name;
        return buffer;
    }
    async _initFromArrayBufferAsync(arrayBuffer) {
        this._audioBuffer = await this.engine._audioContext.decodeAudioData(arrayBuffer);
    }
    async _initFromUrlAsync(url) {
        url = _CleanUrl(url);
        await this._initFromArrayBufferAsync(await (await fetch(url)).arrayBuffer());
    }
    async _initFromUrlsAsync(urls, skipCodecCheck) {
        for (const url of urls) {
            if (skipCodecCheck) {
                // eslint-disable-next-line no-await-in-loop
                await this._initFromUrlAsync(url);
            }
            else {
                const matches = url.match(_FileExtensionRegex);
                const format = matches?.at(1);
                if (format && this.engine.isFormatValid(format)) {
                    try {
                        // eslint-disable-next-line no-await-in-loop
                        await this._initFromUrlAsync(url);
                    }
                    catch {
                        if (format && 0 < format.length) {
                            this.engine.flagInvalidFormat(format);
                        }
                    }
                }
            }
            if (this._audioBuffer) {
                break;
            }
        }
    }
}
/** @internal */
class _WebAudioStaticSoundInstance extends _StaticSoundInstance {
    constructor(sound, options) {
        super(sound);
        this._enginePlayTime = 0;
        this._enginePauseTime = 0;
        this._isConnected = false;
        this._pitch = null;
        this._playbackRate = null;
        this._sourceNode = null;
        this._onEnded = () => {
            this._enginePlayTime = 0;
            this.onEndedObservable.notifyObservers(this);
            this._deinitSourceNode();
        };
        this._onEngineStateChanged = () => {
            if (this.engine.state !== "running") {
                return;
            }
            if (this._options.loop && this.state === 2 /* SoundState.Starting */) {
                this.play();
            }
            this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
        };
        this._options = options;
        this._volumeNode = new GainNode(sound._audioContext);
        this._initSourceNode();
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._pitch?.dispose();
        this._playbackRate?.dispose();
        this._sourceNode = null;
        this.stop();
        this._deinitSourceNode();
        this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
    }
    /** @internal */
    get currentTime() {
        if (this._state === 1 /* SoundState.Stopped */) {
            return 0;
        }
        const timeSinceLastStart = this._state === 5 /* SoundState.Paused */ ? 0 : this.engine.currentTime - this._enginePlayTime;
        return this._enginePauseTime + timeSinceLastStart + this._options.startOffset;
    }
    set currentTime(value) {
        const restart = this._state === 2 /* SoundState.Starting */ || this._state === 3 /* SoundState.Started */;
        if (restart) {
            this.stop();
            this._deinitSourceNode();
        }
        this._options.startOffset = value;
        if (restart) {
            this.play();
        }
    }
    get _outNode() {
        return this._volumeNode;
    }
    /** @internal */
    set pitch(value) {
        this._pitch?.setTargetValue(value);
    }
    /** @internal */
    set playbackRate(value) {
        this._playbackRate?.setTargetValue(value);
    }
    /** @internal */
    get startTime() {
        if (this._state === 1 /* SoundState.Stopped */) {
            return 0;
        }
        return this._enginePlayTime;
    }
    /** @internal */
    getClassName() {
        return "_WebAudioStaticSoundInstance";
    }
    /** @internal */
    play(options = {}) {
        if (this._state === 3 /* SoundState.Started */) {
            return;
        }
        if (options.duration !== undefined) {
            this._options.duration = options.duration;
        }
        if (options.loop !== undefined) {
            this._options.loop = options.loop;
        }
        if (options.loopStart !== undefined) {
            this._options.loopStart = options.loopStart;
        }
        if (options.loopEnd !== undefined) {
            this._options.loopEnd = options.loopEnd;
        }
        if (options.startOffset !== undefined) {
            this._options.startOffset = options.startOffset;
        }
        let startOffset = this._options.startOffset;
        if (this._state === 5 /* SoundState.Paused */) {
            startOffset += this.currentTime;
            startOffset %= this._sound.buffer.duration;
        }
        this._enginePlayTime = this.engine.currentTime + (options.waitTime ?? 0);
        this._volumeNode.gain.value = options.volume ?? 1;
        this._initSourceNode();
        if (this.engine.state === "running") {
            this._setState(3 /* SoundState.Started */);
            this._sourceNode?.start(this._enginePlayTime, startOffset, this._options.duration > 0 ? this._options.duration : undefined);
        }
        else if (this._options.loop) {
            this._setState(2 /* SoundState.Starting */);
            this.engine.stateChangedObservable.add(this._onEngineStateChanged);
        }
    }
    /** @internal */
    pause() {
        if (this._state === 5 /* SoundState.Paused */) {
            return;
        }
        this._setState(5 /* SoundState.Paused */);
        this._enginePauseTime += this.engine.currentTime - this._enginePlayTime;
        this._sourceNode?.stop();
        this._deinitSourceNode();
    }
    /** @internal */
    resume() {
        if (this._state === 5 /* SoundState.Paused */) {
            this.play();
        }
    }
    /** @internal */
    stop(options = {}) {
        if (this._state === 1 /* SoundState.Stopped */) {
            return;
        }
        this._setState(1 /* SoundState.Stopped */);
        const engineStopTime = this.engine.currentTime + (options.waitTime ?? 0);
        this._sourceNode?.stop(engineStopTime);
        this.engine.stateChangedObservable.removeCallback(this._onEngineStateChanged);
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the sound's subgraph.
        if (node instanceof _WebAudioStaticSound && node._inNode) {
            this._outNode?.connect(node._inNode);
            this._isConnected = true;
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node instanceof _WebAudioStaticSound && node._inNode) {
            this._outNode?.disconnect(node._inNode);
            this._isConnected = false;
        }
        return true;
    }
    _deinitSourceNode() {
        if (!this._sourceNode) {
            return;
        }
        if (this._isConnected && !this._disconnect(this._sound)) {
            throw new Error("Disconnect failed");
        }
        this._sourceNode.disconnect(this._volumeNode);
        this._sourceNode.removeEventListener("ended", this._onEnded);
        this._sourceNode = null;
    }
    _initSourceNode() {
        if (!this._sourceNode) {
            this._sourceNode = new AudioBufferSourceNode(this._sound._audioContext, { buffer: this._sound.buffer._audioBuffer });
            this._sourceNode.addEventListener("ended", this._onEnded, { once: true });
            this._sourceNode.connect(this._volumeNode);
            if (!this._connect(this._sound)) {
                throw new Error("Connect failed");
            }
            this._pitch = new _WebAudioParameterComponent(this.engine, this._sourceNode.detune);
            this._playbackRate = new _WebAudioParameterComponent(this.engine, this._sourceNode.playbackRate);
        }
        const node = this._sourceNode;
        node.detune.value = this._sound.pitch;
        node.loop = this._options.loop;
        node.loopEnd = this._options.loopEnd;
        node.loopStart = this._options.loopStart;
        node.playbackRate.value = this._sound.playbackRate;
    }
}
//# sourceMappingURL=webAudioStaticSound.js.map