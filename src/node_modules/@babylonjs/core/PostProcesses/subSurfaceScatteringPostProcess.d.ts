import type { Nullable } from "../types.js";
import type { Camera } from "../Cameras/camera.js";
import type { PostProcessOptions } from "./postProcess.js";
import { PostProcess } from "./postProcess.js";
import type { AbstractEngine } from "../Engines/abstractEngine.js";
import type { Scene } from "../scene.js";
import "../Shaders/imageProcessing.fragment.js";
import "../Shaders/subSurfaceScattering.fragment.js";
import "../Shaders/postprocess.vertex.js";
import "../ShadersWGSL/imageProcessing.fragment.js";
import "../ShadersWGSL/subSurfaceScattering.fragment.js";
import "../ShadersWGSL/postprocess.vertex.js";
/**
 * Sub surface scattering post process
 */
export declare class SubSurfaceScatteringPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "SubSurfaceScatteringPostProcess" string
     */
    getClassName(): string;
    constructor(name: string, scene: Scene, options: number | PostProcessOptions, camera?: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, textureType?: number);
}
