import type { Nullable, AbstractEngine, EffectWrapperCreationOptions } from "../index.js";
import { EffectWrapper } from "../Materials/effectRenderer.js";
import { Vector2 } from "../Maths/math.vector.js";
/**
 * @internal
 */
export declare class ThinSSRBlurPostProcess extends EffectWrapper {
    static readonly FragmentUrl = "screenSpaceReflection2Blur";
    static readonly Uniforms: string[];
    static readonly Samplers: string[];
    protected _gatherImports(useWebGPU: boolean, list: Promise<any>[]): void;
    constructor(name: string, engine?: Nullable<AbstractEngine>, direction?: Vector2, blurStrength?: number, options?: EffectWrapperCreationOptions);
    textureWidth: number;
    textureHeight: number;
    direction: Vector2;
    blurStrength: number;
    bind(noDefaultBindings?: boolean): void;
}
