import { RegisterClass } from "../../../../Misc/typeStore.js";
import { ImageSourceBlock } from "./imageSourceBlock.js";
/**
 * Block used to provide an depth texture for a TextureBlock
 */
export class DepthSourceBlock extends ImageSourceBlock {
    /**
     * Creates a new DepthSourceBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
    }
    /**
     * Gets or sets the texture associated with the node
     */
    get texture() {
        return this._texture;
    }
    set texture(texture) {
        // Do nothing, we always use the depth texture from the scene
    }
    bind(effect, nodeMaterial) {
        const scene = nodeMaterial.getScene();
        const renderer = scene.enableDepthRenderer();
        this._texture = renderer.getDepthMap();
        super.bind(effect, nodeMaterial);
    }
    isReady() {
        return true;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "DepthSourceBlock";
    }
    _dumpPropertiesCode() {
        return super._dumpPropertiesCode(true);
    }
    serialize() {
        return super.serialize(true);
    }
}
RegisterClass("BABYLON.DepthSourceBlock", DepthSourceBlock);
//# sourceMappingURL=depthSourceBlock.js.map