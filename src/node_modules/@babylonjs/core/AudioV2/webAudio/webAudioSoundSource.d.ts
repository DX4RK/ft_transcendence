import type { Nullable } from "../../types.js";
import type { ISoundSourceOptions } from "../abstractAudio/abstractSoundSource.js";
import { AbstractSoundSource } from "../abstractAudio/abstractSoundSource.js";
import type { _SpatialAudio } from "../abstractAudio/subProperties/spatialAudio.js";
import { _StereoAudio } from "../abstractAudio/subProperties/stereoAudio.js";
import { _WebAudioBusAndSoundSubGraph } from "./subNodes/webAudioBusAndSoundSubGraph.js";
import type { _WebAudioEngine } from "./webAudioEngine.js";
import type { IWebAudioInNode } from "./webAudioNode.js";
/** @internal */
export declare class _WebAudioSoundSource extends AbstractSoundSource {
    private _spatial;
    private readonly _spatialAutoUpdate;
    private readonly _spatialMinUpdateTime;
    private _stereo;
    protected _subGraph: _WebAudioBusAndSoundSubGraph;
    protected _webAudioNode: AudioNode;
    /** @internal */
    _audioContext: AudioContext | OfflineAudioContext;
    /** @internal */
    readonly engine: _WebAudioEngine;
    /** @internal */
    constructor(name: string, webAudioNode: AudioNode, engine: _WebAudioEngine, options: Partial<ISoundSourceOptions>);
    /** @internal */
    _initAsync(options: Partial<ISoundSourceOptions>): Promise<void>;
    /** @internal */
    get _inNode(): AudioNode;
    /** @internal */
    get _outNode(): Nullable<AudioNode>;
    /** @internal */
    get spatial(): _SpatialAudio;
    /** @internal */
    get stereo(): _StereoAudio;
    /** @internal */
    dispose(): void;
    /** @internal */
    getClassName(): string;
    protected _connect(node: IWebAudioInNode): boolean;
    protected _disconnect(node: IWebAudioInNode): boolean;
    private _initSpatialProperty;
    private static _SubGraph;
}
