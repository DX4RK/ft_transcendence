import type { Nullable } from "../../types.js";
import { AudioNodeType } from "./abstractAudioNode.js";
import type { IAbstractAudioOutNodeOptions } from "./abstractAudioOutNode.js";
import { AbstractAudioOutNode } from "./abstractAudioOutNode.js";
import type { PrimaryAudioBus } from "./audioBus.js";
import type { AudioEngineV2 } from "./audioEngineV2.js";
import type { AbstractSpatialAudio, ISpatialAudioOptions } from "./subProperties/abstractSpatialAudio.js";
import type { AbstractStereoAudio, IStereoAudioOptions } from "./subProperties/abstractStereoAudio.js";
/**
 * Options for creating a sound source.
 */
export interface ISoundSourceOptions extends IAbstractAudioOutNodeOptions, ISpatialAudioOptions, IStereoAudioOptions {
    /**
     * The output bus for the sound source. Defaults to `null`.
     * - If not set or `null`, and `outBusAutoDefault` is `true`, then the sound source is automatically connected to the audio engine's default main bus.
     * @see {@link AudioEngineV2.defaultMainBus}
     */
    outBus: Nullable<PrimaryAudioBus>;
    /**
     * Whether the sound's `outBus` should default to the audio engine's main bus. Defaults to `true` for all sound sources except microphones.
     */
    outBusAutoDefault: boolean;
}
/**
 * Abstract class representing a sound in the audio engine.
 */
export declare abstract class AbstractSoundSource extends AbstractAudioOutNode {
    private _outBus;
    protected constructor(name: string, engine: AudioEngineV2, nodeType?: AudioNodeType);
    /**
     * The output bus for the sound.
     * @see {@link AudioEngineV2.defaultMainBus}
     */
    get outBus(): Nullable<PrimaryAudioBus>;
    set outBus(outBus: Nullable<PrimaryAudioBus>);
    /**
     * The spatial features of the sound.
     */
    abstract spatial: AbstractSpatialAudio;
    /**
     * The stereo features of the sound.
     */
    abstract stereo: AbstractStereoAudio;
    /**
     * Releases associated resources.
     */
    dispose(): void;
    private _onOutBusDisposed;
}
