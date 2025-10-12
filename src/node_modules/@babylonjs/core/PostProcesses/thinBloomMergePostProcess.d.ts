import type { Nullable, AbstractEngine, EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.js";
/**
 * @internal
 */
export declare class ThinBloomMergePostProcess extends EffectWrapper {
    static readonly FragmentUrl = "bloomMerge";
    static readonly Uniforms: string[];
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
    /** Weight of the bloom to be added to the original input. */
    weight: number;
    bind(noDefaultBindings?: boolean): void;
}
