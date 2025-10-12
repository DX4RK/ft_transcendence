import type { Nullable } from "../types.js";
import type { Camera } from "../Cameras/camera.js";
import type { PostProcessOptions } from "./postProcess.js";
import { PostProcess } from "./postProcess.js";
import type { AbstractEngine } from "../Engines/abstractEngine.js";
import { ThinExtractHighlightsPostProcess } from "./thinExtractHighlightsPostProcess.js";
/**
 * The extract highlights post process sets all pixels to black except pixels above the specified luminance threshold. Used as the first step for a bloom effect.
 */
export declare class ExtractHighlightsPostProcess extends PostProcess {
    /**
     * The luminance threshold, pixels below this value will be set to black.
     */
    get threshold(): number;
    set threshold(value: number);
    /** @internal */
    get _exposure(): number;
    /** @internal */
    set _exposure(value: number);
    /**
     * Post process which has the input texture to be used when performing highlight extraction
     * @internal
     */
    _inputPostProcess: Nullable<PostProcess>;
    /**
     * Gets a string identifying the name of the class
     * @returns "ExtractHighlightsPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinExtractHighlightsPostProcess;
    constructor(name: string, options: number | PostProcessOptions, camera?: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number, blockCompilation?: boolean);
}
