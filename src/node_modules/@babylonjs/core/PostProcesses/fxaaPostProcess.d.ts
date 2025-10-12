import type { Nullable } from "../types.js";
import type { Camera } from "../Cameras/camera.js";
import type { PostProcessOptions } from "./postProcess.js";
import { PostProcess } from "./postProcess.js";
import type { AbstractEngine } from "../Engines/abstractEngine.js";
import { ThinFXAAPostProcess } from "./thinFXAAPostProcess.js";
import type { Scene } from "../scene.js";
/**
 * Fxaa post process
 * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#fxaa
 */
export declare class FxaaPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "FxaaPostProcess" string
     */
    getClassName(): string;
    protected _effectWrapper: ThinFXAAPostProcess;
    constructor(name: string, options: number | PostProcessOptions, camera?: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number);
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): FxaaPostProcess;
}
