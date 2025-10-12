const Instances = [];
/**
 * Gets the most recently created v2 audio engine.
 * @returns The most recently created v2 audio engine.
 */
export function LastCreatedAudioEngine() {
    if (Instances.length === 0) {
        return null;
    }
    return Instances[Instances.length - 1];
}
/**
 * Abstract base class for v2 audio engines.
 *
 * A v2 audio engine based on the WebAudio API can be created with the {@link CreateAudioEngineAsync} function.
 */
export class AudioEngineV2 {
    constructor(options) {
        /** Not owned, but all items should be in `_nodes` container, too, which is owned. */
        this._mainBuses = new Set();
        /** Owned top-level sound and bus nodes. */
        this._nodes = new Set();
        this._defaultMainBus = null;
        this._parameterRampDuration = 0.01;
        Instances.push(this);
        if (typeof options.parameterRampDuration === "number") {
            this.parameterRampDuration = options.parameterRampDuration;
        }
    }
    /**
     * The default main bus that will be used for audio buses and sounds if their `outBus` option is not set.
     * @see {@link IAudioBusOptions.outBus}
     * @see {@link IAbstractSoundOptions.outBus}
     */
    get defaultMainBus() {
        if (this._mainBuses.size === 0) {
            return null;
        }
        if (!this._defaultMainBus) {
            this._defaultMainBus = Array.from(this._mainBuses)[0];
        }
        return this._defaultMainBus;
    }
    /**
     * The smoothing duration to use when changing audio parameters, in seconds. Defaults to `0.01` (10 milliseconds).
     *
     * Due to limitations in some browsers, it is not recommended to set this value to longer than `0.01` seconds.
     *
     * Setting this value to longer than `0.01` seconds may result in errors being throw when setting audio parameters.
     */
    get parameterRampDuration() {
        return this._parameterRampDuration;
    }
    set parameterRampDuration(value) {
        this._parameterRampDuration = Math.max(0, value);
    }
    /**
     * Releases associated resources.
     */
    dispose() {
        if (Instances.includes(this)) {
            Instances.splice(Instances.indexOf(this), 1);
        }
        const nodeIt = this._nodes.values();
        for (let next = nodeIt.next(); !next.done; next = nodeIt.next()) {
            next.value.dispose();
        }
        this._mainBuses.clear();
        this._nodes.clear();
        this._defaultMainBus = null;
    }
    /**
     * Unlocks the audio engine if it is locked.
     * - Note that the returned promise may already be resolved if the audio engine is already unlocked.
     * @returns A promise that is resolved when the audio engine is unlocked.
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    unlockAsync() {
        return this.resumeAsync();
    }
    _addMainBus(mainBus) {
        this._mainBuses.add(mainBus);
        this._addNode(mainBus);
    }
    _removeMainBus(mainBus) {
        this._mainBuses.delete(mainBus);
        this._defaultMainBus = null;
        this._removeNode(mainBus);
    }
    _addNode(node) {
        this._nodes.add(node);
    }
    _removeNode(node) {
        this._nodes.delete(node);
    }
}
/**
 * @internal
 * @param engine - The given audio engine. If `null` then the last created audio engine is used.
 * @returns the given audio engine or the last created audio engine.
 * @throws An error if the resulting engine is `null`.
 */
export function _GetAudioEngine(engine) {
    if (!engine) {
        engine = LastCreatedAudioEngine();
    }
    if (engine) {
        return engine;
    }
    throw new Error("No audio engine.");
}
/**
 * Creates a new audio bus.
 * @param name - The name of the audio bus.
 * @param options - The options to use when creating the audio bus.
 * @param engine - The audio engine.
 * @returns A promise that resolves with the created audio bus.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateAudioBusAsync(name, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createBusAsync(name, options);
}
/**
 * Creates a new main audio bus.
 * @param name - The name of the main audio bus.
 * @param options - The options to use when creating the main audio bus.
 * @param engine - The audio engine.
 * @returns A promise that resolves with the created main audio bus.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateMainAudioBusAsync(name, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createMainBusAsync(name, options);
}
/**
 * Creates a new microphone sound source.
 * @param name - The name of the sound.
 * @param options - The options for the sound source.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created sound source.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateMicrophoneSoundSourceAsync(name, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createMicrophoneSoundSourceAsync(name, options);
}
/**
 * Creates a new static sound.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the static sound.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created static sound.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateSoundAsync(name, source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createSoundAsync(name, source, options);
}
/**
 * Creates a new static sound buffer.
 * @param source - The source of the sound buffer.
 * @param options - The options for the static sound buffer.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created static sound buffer.
 */
export async function CreateSoundBufferAsync(source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return await engine.createSoundBufferAsync(source, options);
}
/**
 * Creates a new sound source.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the sound source.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created sound source.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateSoundSourceAsync(name, source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createSoundSourceAsync(name, source, options);
}
/**
 * Creates a new streaming sound.
 * @param name - The name of the sound.
 * @param source - The source of the sound.
 * @param options - The options for the streaming sound.
 * @param engine - The audio engine.
 * @returns A promise that resolves to the created streaming sound.
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
export function CreateStreamingSoundAsync(name, source, options = {}, engine = null) {
    engine = _GetAudioEngine(engine);
    return engine.createStreamingSoundAsync(name, source, options);
}
//# sourceMappingURL=audioEngineV2.js.map