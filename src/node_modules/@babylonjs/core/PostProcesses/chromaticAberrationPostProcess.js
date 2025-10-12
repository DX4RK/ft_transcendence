import { __decorate } from "../tslib.es6.js";
import { PostProcess } from "./postProcess.js";

import { RegisterClass } from "../Misc/typeStore.js";
import { serialize } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { ThinChromaticAberrationPostProcess } from "./thinChromaticAberrationPostProcess.js";
/**
 * The ChromaticAberrationPostProcess separates the rgb channels in an image to produce chromatic distortion around the edges of the screen
 */
export class ChromaticAberrationPostProcess extends PostProcess {
    /**
     * The amount of separation of rgb channels (default: 30)
     */
    get aberrationAmount() {
        return this._effectWrapper.aberrationAmount;
    }
    set aberrationAmount(value) {
        this._effectWrapper.aberrationAmount = value;
    }
    /**
     * The amount the effect will increase for pixels closer to the edge of the screen. (default: 0)
     */
    get radialIntensity() {
        return this._effectWrapper.radialIntensity;
    }
    set radialIntensity(value) {
        this._effectWrapper.radialIntensity = value;
    }
    /**
     * The normalized direction in which the rgb channels should be separated. If set to 0,0 radial direction will be used. (default: Vector2(0.707,0.707))
     */
    get direction() {
        return this._effectWrapper.direction;
    }
    set direction(value) {
        this._effectWrapper.direction = value;
    }
    /**
     * The center position where the radialIntensity should be around. [0.5,0.5 is center of screen, 1,1 is top right corner] (default: Vector2(0.5 ,0.5))
     */
    get centerPosition() {
        return this._effectWrapper.centerPosition;
    }
    set centerPosition(value) {
        this._effectWrapper.centerPosition = value;
    }
    /** The width of the screen to apply the effect on */
    get screenWidth() {
        return this._effectWrapper.screenWidth;
    }
    set screenWidth(value) {
        this._effectWrapper.screenWidth = value;
    }
    /** The height of the screen to apply the effect on */
    get screenHeight() {
        return this._effectWrapper.screenHeight;
    }
    set screenHeight(value) {
        this._effectWrapper.screenHeight = value;
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "ChromaticAberrationPostProcess" string
     */
    getClassName() {
        return "ChromaticAberrationPostProcess";
    }
    /**
     * Creates a new instance ChromaticAberrationPostProcess
     * @param name The name of the effect.
     * @param screenWidth The width of the screen to apply the effect on.
     * @param screenHeight The height of the screen to apply the effect on.
     * @param options The required width/height ratio to downsize to before computing the render pass.
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
     */
    constructor(name, screenWidth, screenHeight, options, camera, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
        const localOptions = {
            uniforms: ThinChromaticAberrationPostProcess.Uniforms,
            size: typeof options === "number" ? options : undefined,
            camera,
            samplingMode,
            engine,
            reusable,
            textureType,
            blockCompilation,
            ...options,
        };
        super(name, ThinChromaticAberrationPostProcess.FragmentUrl, {
            effectWrapper: typeof options === "number" || !options.effectWrapper ? new ThinChromaticAberrationPostProcess(name, engine, localOptions) : undefined,
            ...localOptions,
        });
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }
    /**
     * @internal
     */
    static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(() => {
            return new ChromaticAberrationPostProcess(parsedPostProcess.name, parsedPostProcess.screenWidth, parsedPostProcess.screenHeight, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType, false);
        }, parsedPostProcess, scene, rootUrl);
    }
}
__decorate([
    serialize()
], ChromaticAberrationPostProcess.prototype, "aberrationAmount", null);
__decorate([
    serialize()
], ChromaticAberrationPostProcess.prototype, "radialIntensity", null);
__decorate([
    serialize()
], ChromaticAberrationPostProcess.prototype, "direction", null);
__decorate([
    serialize()
], ChromaticAberrationPostProcess.prototype, "centerPosition", null);
__decorate([
    serialize()
], ChromaticAberrationPostProcess.prototype, "screenWidth", null);
__decorate([
    serialize()
], ChromaticAberrationPostProcess.prototype, "screenHeight", null);
RegisterClass("BABYLON.ChromaticAberrationPostProcess", ChromaticAberrationPostProcess);
//# sourceMappingURL=chromaticAberrationPostProcess.js.map