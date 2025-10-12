import type { IAbstractSoundInstanceOptions } from "./abstractSoundInstance.js";
import { _AbstractSoundInstance } from "./abstractSoundInstance.js";
import type { IStaticSoundOptionsBase, IStaticSoundPlayOptions, IStaticSoundStopOptions } from "./staticSound.js";
/**
 * Options for creating a static sound instance.
 * @internal
 */
export interface IStaticSoundInstanceOptions extends IAbstractSoundInstanceOptions, IStaticSoundOptionsBase {
}
/** @internal */
export declare abstract class _StaticSoundInstance extends _AbstractSoundInstance {
    protected abstract readonly _options: IStaticSoundInstanceOptions;
    abstract pitch: number;
    abstract playbackRate: number;
    abstract play(options: Partial<IStaticSoundPlayOptions>): void;
    abstract stop(options?: Partial<IStaticSoundStopOptions>): void;
}
