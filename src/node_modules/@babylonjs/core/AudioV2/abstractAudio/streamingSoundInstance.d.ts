import { Observable } from "../../Misc/observable.js";
import type { IAbstractSoundInstanceOptions } from "./abstractSoundInstance.js";
import { _AbstractSoundInstance } from "./abstractSoundInstance.js";
import type { IStreamingSoundOptionsBase, StreamingSound } from "./streamingSound.js";
/**
 * Options for creating streaming sound instance.
 * @internal
 */
export interface IStreamingSoundInstanceOptions extends IAbstractSoundInstanceOptions, IStreamingSoundOptionsBase {
}
/** @internal */
export declare abstract class _StreamingSoundInstance extends _AbstractSoundInstance {
    private _rejectPreloadedProimse;
    private _resolvePreloadedPromise;
    protected abstract readonly _options: IStreamingSoundInstanceOptions;
    /** @internal */
    readonly onReadyObservable: Observable<_StreamingSoundInstance>;
    /** @internal */
    readonly preloadedPromise: Promise<void>;
    protected constructor(sound: StreamingSound);
    /** @internal */
    set startOffset(value: number);
    /** @internal */
    dispose(): void;
}
