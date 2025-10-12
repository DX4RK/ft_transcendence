import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { CurrentScreenBlock } from "./currentScreenBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { InputBlock } from "../Input/inputBlock.js";
import { SfeModeDefine } from "../Fragment/smartFilterFragmentOutputBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { ImageSourceBlock } from "./imageSourceBlock.js";
/**
 * Base block used for creating Smart Filter shader blocks for the SFE framework.
 * This block extends the functionality of CurrentScreenBlock, as both are used
 * to represent arbitrary 2D textures to compose, and work similarly.
 */
export class SmartFilterTextureBlock extends CurrentScreenBlock {
    /**
     * Gets the sampler name associated with this texture
     */
    get samplerName() {
        if (this.source.connectedPoint) {
            return this.source.connectedPoint.ownerBlock.samplerName;
        }
        return this._samplerName;
    }
    /**
     * Gets or sets the texture associated with this block
     */
    get texture() {
        if (this.source.connectedPoint) {
            return this.source.connectedPoint.ownerBlock.texture;
        }
        return this._texture;
    }
    set texture(value) {
        this._texture = value;
    }
    /**
     * Create a new SmartFilterTextureBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this._firstInit = true;
        /**
         * A boolean indicating whether this block should be the main input for the SFE pipeline.
         * If true, it can be used in SFE for auto-disabling.
         */
        this.isMainInput = false;
        this.registerInput("source", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.VertexAndFragment, new NodeMaterialConnectionPointCustomObject("source", this, 0 /* NodeMaterialConnectionPointDirection.Input */, ImageSourceBlock, "ImageSourceBlock"));
    }
    /**
     * Gets the source input component
     */
    get source() {
        return this._inputs[1];
    }
    /**
     * Gets a boolean indicating that this block is linked to an ImageSourceBlock
     */
    get hasImageSource() {
        return this.source.isConnected;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "SmartFilterTextureBlock";
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        if (this._firstInit) {
            this._samplerName = state._getFreeVariableName(this.name);
            this._firstInit = false;
        }
    }
    _getMainUvName(state) {
        // Get the ScreenUVBlock's name, which is required for SFE and should be vUV.
        // NOTE: In the future, when we move to vertex shaders, update this to check for the nearest vec2 varying output.
        const screenUv = state.sharedData.nodeMaterial.getInputBlockByPredicate((b) => b.isAttribute && b.name === "postprocess_uv");
        if (!screenUv || !screenUv.isAnAncestorOf(this)) {
            state.sharedData.raiseBuildError("SmartFilterTextureBlock: 'postprocess_uv' attribute from ScreenUVBlock is required.");
            return "";
        }
        return screenUv.associatedVariableName;
    }
    _emitUvAndSampler(state) {
        if (state.target === NodeMaterialBlockTargets.Fragment) {
            // Wrap the varying in a define, as it won't be needed in SFE.
            state._emitVaryingFromString(this._mainUVName, NodeMaterialBlockConnectionPointTypes.Vector2, SfeModeDefine, true);
            if (!this.hasImageSource) {
                // Append `// main` to denote this as the main input texture to composite
                const annotation = this.isMainInput ? "// main" : undefined;
                state._emit2DSampler(this._samplerName, undefined, undefined, annotation);
            }
        }
    }
    autoConfigure(material, additionalFilteringInfo = () => true) {
        if (!this.uv.isConnected) {
            let uvInput = material.getInputBlockByPredicate((b) => b.isAttribute && b.name === "postprocess_uv" && additionalFilteringInfo(b));
            if (!uvInput) {
                uvInput = new InputBlock("uv");
                uvInput.setAsAttribute("postprocess_uv");
            }
            uvInput.output.connectTo(this.uv);
        }
    }
    _postBuildBlock() {
        this._firstInit = true;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.isMainInput = this.isMainInput;
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        this.isMainInput = serializationObject.isMainInput;
    }
}
RegisterClass("BABYLON.SmartFilterTextureBlock", SmartFilterTextureBlock);
//# sourceMappingURL=smartFilterTextureBlock.js.map