import { Texture } from "../Materials/Textures/texture.js";
import { PostProcess } from "./postProcess.js";

import { RegisterClass } from "../Misc/typeStore.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinFXAAPostProcess } from "./thinFXAAPostProcess.js";
/**
 * Fxaa post process
 * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#fxaa
 */
export class FxaaPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "FxaaPostProcess" string
     */
    getClassName() {
        return "FxaaPostProcess";
    }
    constructor(name, options, camera = null, samplingMode, engine, reusable, textureType = 0) {
        const localOptions = {
            uniforms: ThinFXAAPostProcess.Uniforms,
            size: typeof options === "number" ? options : undefined,
            camera,
            samplingMode: samplingMode || Texture.BILINEAR_SAMPLINGMODE,
            engine,
            reusable,
            textureType,
            ...options,
        };
        super(name, ThinFXAAPostProcess.FragmentUrl, {
            effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinFXAAPostProcess(name, engine, localOptions) : undefined,
            ...localOptions,
        });
        this.onApplyObservable.add((_effect) => {
            this._effectWrapper.texelSize = this.texelSize;
        });
    }
    /**
     * @internal
     */
    static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(() => {
            return new FxaaPostProcess(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable);
        }, parsedPostProcess, scene, rootUrl);
    }
}
RegisterClass("BABYLON.FxaaPostProcess", FxaaPostProcess);
//# sourceMappingURL=fxaaPostProcess.js.map