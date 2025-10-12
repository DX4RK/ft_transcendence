import type { Nullable, AbstractEngine, EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.js";
/**
 * @internal
 */
export declare class ThinDepthOfFieldMergePostProcess extends EffectWrapper {
    static readonly FragmentUrl = "depthOfFieldMerge";
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    constructor(name: string, engine?: Nullable<AbstractEngine>, options?: EffectWrapperCreationOptions);
}
