import { __decorate } from "../../../../tslib.es6.js";
import { NodeRenderGraphBlock } from "../../nodeRenderGraphBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeRenderGraphConnectionPoint } from "../../nodeRenderGraphBlockConnectionPoint.js";
import { NodeRenderGraphConnectionPointCustomObject } from "../../nodeRenderGraphConnectionPointCustomObject.js";
import { FrameGraphObjectRendererTask } from "../../../Tasks/Rendering/objectRendererTask.js";
/**
 * @internal
 */
export class NodeRenderGraphBaseObjectRendererBlock extends NodeRenderGraphBlock {
    /**
     * Gets the frame graph task associated with this block
     */
    get task() {
        return this._frameGraphTask;
    }
    /**
     * Create a new NodeRenderGraphBaseObjectRendererBlock
     * @param name defines the block name
     * @param frameGraph defines the hosting frame graph
     * @param scene defines the hosting scene
     * @param doNotChangeAspectRatio True (default) to not change the aspect ratio of the scene in the RTT
     * @param enableClusteredLights True (default) to enable clustered lights
     */
    constructor(name, frameGraph, scene, doNotChangeAspectRatio = true, enableClusteredLights = true) {
        super(name, frameGraph, scene);
        this._additionalConstructionParameters = [doNotChangeAspectRatio, enableClusteredLights];
        this.registerInput("target", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
        this.registerInput("depth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
        this.registerInput("objects", NodeRenderGraphBlockConnectionPointTypes.ObjectList);
        this._addDependenciesInput();
        this.registerInput("shadowGenerators", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
        this.registerOutput("output", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
        this.registerOutput("outputDepth", NodeRenderGraphBlockConnectionPointTypes.BasedOnInput);
        this.registerOutput("objectRenderer", NodeRenderGraphBlockConnectionPointTypes.Object, new NodeRenderGraphConnectionPointCustomObject("objectRenderer", this, 1 /* NodeRenderGraphConnectionPointDirection.Output */, NodeRenderGraphBaseObjectRendererBlock, "NodeRenderGraphBaseObjectRendererBlock"));
        this.target.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureAllButBackBufferDepthStencil);
        this.depth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureDepthStencilAttachment | NodeRenderGraphBlockConnectionPointTypes.TextureBackBufferDepthStencilAttachment);
        this.shadowGenerators.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.ShadowGenerator | NodeRenderGraphBlockConnectionPointTypes.ResourceContainer);
        this.output._typeConnectionSource = this.target;
        this.outputDepth._typeConnectionSource = this.depth;
        this._createFrameGraphObject();
    }
    _createFrameGraphObject() {
        this._frameGraphTask?.dispose();
        this._frameGraphTask = new FrameGraphObjectRendererTask(this.name, this._frameGraph, this._scene, {
            doNotChangeAspectRatio: this._additionalConstructionParameters[0],
            enableClusteredLights: this._additionalConstructionParameters[1],
        });
    }
    _saveState(state) {
        state.disabled = this._frameGraphTask.disabled;
        state.isMainObjectRenderer = this.isMainObjectRenderer;
        state.depthTest = this.depthTest;
        state.depthWrite = this.depthWrite;
        state.disableShadows = this.disableShadows;
        state.renderInLinearSpace = this.renderInLinearSpace;
        state.renderParticles = this.renderParticles;
        state.renderSprites = this.renderSprites;
        state.forceLayerMaskCheck = this.forceLayerMaskCheck;
        state.enableBoundingBoxRendering = this.enableBoundingBoxRendering;
        state.enableOutlineRendering = this.enableOutlineRendering;
    }
    _restoreState(state) {
        this._frameGraphTask.disabled = state.disabled;
        this.isMainObjectRenderer = state.isMainObjectRenderer;
        this.depthTest = state.depthTest;
        this.depthWrite = state.depthWrite;
        this.disableShadows = state.disableShadows;
        this.renderInLinearSpace = state.renderInLinearSpace;
        this.renderParticles = state.renderParticles;
        this.renderSprites = state.renderSprites;
        this.forceLayerMaskCheck = state.forceLayerMaskCheck;
        this.enableBoundingBoxRendering = state.enableBoundingBoxRendering;
        this.enableOutlineRendering = state.enableOutlineRendering;
    }
    _createFrameGraphObjectWithState(doNotChangeAspectRatio, enableClusteredLights) {
        const state = {};
        this._saveState(state);
        this._additionalConstructionParameters = [doNotChangeAspectRatio, enableClusteredLights];
        this._createFrameGraphObject();
        this._restoreState(state);
    }
    /** Indicates that this object renderer is the main object renderer of the frame graph. */
    get isMainObjectRenderer() {
        return this._frameGraphTask.isMainObjectRenderer;
    }
    set isMainObjectRenderer(value) {
        this._frameGraphTask.isMainObjectRenderer = value;
    }
    /** Indicates if depth testing must be enabled or disabled */
    get depthTest() {
        return this._frameGraphTask.depthTest;
    }
    set depthTest(value) {
        this._frameGraphTask.depthTest = value;
    }
    /** Indicates if depth writing must be enabled or disabled */
    get depthWrite() {
        return this._frameGraphTask.depthWrite;
    }
    set depthWrite(value) {
        this._frameGraphTask.depthWrite = value;
    }
    /** Indicates if particles should be rendered */
    get renderParticles() {
        return this._frameGraphTask.renderParticles;
    }
    set renderParticles(value) {
        this._frameGraphTask.renderParticles = value;
    }
    /** Indicates if sprites should be rendered */
    get renderSprites() {
        return this._frameGraphTask.renderSprites;
    }
    set renderSprites(value) {
        this._frameGraphTask.renderSprites = value;
    }
    /** Indicates if layer mask check must be forced */
    get forceLayerMaskCheck() {
        return this._frameGraphTask.forceLayerMaskCheck;
    }
    set forceLayerMaskCheck(value) {
        this._frameGraphTask.forceLayerMaskCheck = value;
    }
    /** Indicates if bounding boxes should be rendered */
    get enableBoundingBoxRendering() {
        return this._frameGraphTask.enableBoundingBoxRendering;
    }
    set enableBoundingBoxRendering(value) {
        this._frameGraphTask.enableBoundingBoxRendering = value;
    }
    /** Indicates if outlines/overlays should be rendered */
    get enableOutlineRendering() {
        return this._frameGraphTask.enableOutlineRendering;
    }
    set enableOutlineRendering(value) {
        this._frameGraphTask.enableOutlineRendering = value;
    }
    /** Indicates if shadows must be enabled or disabled */
    get disableShadows() {
        return this._frameGraphTask.disableShadows;
    }
    set disableShadows(value) {
        this._frameGraphTask.disableShadows = value;
    }
    /** If image processing should be disabled */
    get renderInLinearSpace() {
        return this._frameGraphTask.disableImageProcessing;
    }
    set renderInLinearSpace(value) {
        this._frameGraphTask.disableImageProcessing = value;
    }
    /** True (default) to not change the aspect ratio of the scene in the RTT */
    get doNotChangeAspectRatio() {
        return this._frameGraphTask.objectRenderer.options.doNotChangeAspectRatio;
    }
    set doNotChangeAspectRatio(value) {
        this._createFrameGraphObjectWithState(value, this.enableClusteredLights);
    }
    /** True (default) to enable clustered lights */
    get enableClusteredLights() {
        return this._frameGraphTask.objectRenderer.options.enableClusteredLights;
    }
    set enableClusteredLights(value) {
        this._createFrameGraphObjectWithState(this.doNotChangeAspectRatio, value);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphBaseObjectRendererBlock";
    }
    /**
     * Gets the target texture input component
     */
    get target() {
        return this._inputs[0];
    }
    /**
     * Gets the depth texture input component
     */
    get depth() {
        return this._inputs[1];
    }
    /**
     * Gets the camera input component
     */
    get camera() {
        return this._inputs[2];
    }
    /**
     * Gets the objects input component
     */
    get objects() {
        return this._inputs[3];
    }
    /**
     * Gets the dependencies input component
     */
    get dependencies() {
        return this._inputs[4];
    }
    /**
     * Gets the shadowGenerators input component
     */
    get shadowGenerators() {
        return this._inputs[5];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Gets the output depth component
     */
    get outputDepth() {
        return this._outputs[1];
    }
    /**
     * Gets the objectRenderer component
     */
    get objectRenderer() {
        return this._outputs[2];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        this.output.value = this._frameGraphTask.outputTexture; // the value of the output connection point is the "output" texture of the task
        this.outputDepth.value = this._frameGraphTask.outputDepthTexture; // the value of the outputDepth connection point is the "outputDepth" texture of the task
        this.objectRenderer.value = this._frameGraphTask; // the value of the objectRenderer connection point is the task itself
        this._frameGraphTask.targetTexture = this.target.connectedPoint?.value;
        this._frameGraphTask.depthTexture = this.depth.connectedPoint?.value;
        this._frameGraphTask.camera = this.camera.connectedPoint?.value;
        this._frameGraphTask.objectList = this.objects.connectedPoint?.value;
        this._frameGraphTask.shadowGenerators = [];
        const shadowGeneratorsConnectedPoint = this.shadowGenerators.connectedPoint;
        if (shadowGeneratorsConnectedPoint) {
            if (shadowGeneratorsConnectedPoint.type === NodeRenderGraphBlockConnectionPointTypes.ResourceContainer) {
                const container = shadowGeneratorsConnectedPoint.ownerBlock;
                for (const input of container.inputs) {
                    if (input.connectedPoint && input.connectedPoint.value !== undefined && NodeRenderGraphConnectionPoint.IsShadowGenerator(input.connectedPoint.value)) {
                        this._frameGraphTask.shadowGenerators.push(input.connectedPoint.value);
                    }
                }
            }
            else if (NodeRenderGraphConnectionPoint.IsShadowGenerator(shadowGeneratorsConnectedPoint.value)) {
                this._frameGraphTask.shadowGenerators[0] = shadowGeneratorsConnectedPoint.value;
            }
        }
    }
    _dumpPropertiesCode() {
        const codes = [];
        codes.push(`${this._codeVariableName}.isMainObjectRenderer = ${this.isMainObjectRenderer};`);
        codes.push(`${this._codeVariableName}.depthTest = ${this.depthTest};`);
        codes.push(`${this._codeVariableName}.depthWrite = ${this.depthWrite};`);
        codes.push(`${this._codeVariableName}.renderParticles = ${this.renderParticles};`);
        codes.push(`${this._codeVariableName}.renderSprites = ${this.renderSprites};`);
        codes.push(`${this._codeVariableName}.forceLayerMaskCheck = ${this.forceLayerMaskCheck};`);
        codes.push(`${this._codeVariableName}.enableBoundingBoxRendering = ${this.enableBoundingBoxRendering};`);
        codes.push(`${this._codeVariableName}.enableOutlineRendering = ${this.enableOutlineRendering};`);
        codes.push(`${this._codeVariableName}.disableShadows = ${this.disableShadows};`);
        codes.push(`${this._codeVariableName}.renderInLinearSpace = ${this.renderInLinearSpace};`);
        return super._dumpPropertiesCode() + codes.join("\n");
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.isMainObjectRenderer = this.isMainObjectRenderer;
        serializationObject.depthTest = this.depthTest;
        serializationObject.depthWrite = this.depthWrite;
        serializationObject.renderParticles = this.renderParticles;
        serializationObject.renderSprites = this.renderSprites;
        serializationObject.forceLayerMaskCheck = this.forceLayerMaskCheck;
        serializationObject.enableBoundingBoxRendering = this.enableBoundingBoxRendering;
        serializationObject.enableOutlineRendering = this.enableOutlineRendering;
        serializationObject.disableShadows = this.disableShadows;
        serializationObject.renderInLinearSpace = this.renderInLinearSpace;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.isMainObjectRenderer = !!serializationObject.isMainObjectRenderer;
        this.depthTest = serializationObject.depthTest;
        this.depthWrite = serializationObject.depthWrite;
        this.renderParticles = serializationObject.renderParticles ?? true;
        this.renderSprites = serializationObject.renderSprites ?? true;
        this.forceLayerMaskCheck = serializationObject.forceLayerMaskCheck ?? true;
        this.enableBoundingBoxRendering = serializationObject.enableBoundingBoxRendering ?? true;
        this.enableOutlineRendering = serializationObject.enableOutlineRendering ?? true;
        this.disableShadows = serializationObject.disableShadows;
        this.renderInLinearSpace = !!serializationObject.renderInLinearSpace;
    }
}
__decorate([
    editableInPropertyPage("Is main object renderer", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "isMainObjectRenderer", null);
__decorate([
    editableInPropertyPage("Depth test", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "depthTest", null);
__decorate([
    editableInPropertyPage("Depth write", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "depthWrite", null);
__decorate([
    editableInPropertyPage("Render particles", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "renderParticles", null);
__decorate([
    editableInPropertyPage("Render sprites", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "renderSprites", null);
__decorate([
    editableInPropertyPage("Force layer mask check", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "forceLayerMaskCheck", null);
__decorate([
    editableInPropertyPage("Enable bounding box rendering", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "enableBoundingBoxRendering", null);
__decorate([
    editableInPropertyPage("Enable outline/overlay rendering", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "enableOutlineRendering", null);
__decorate([
    editableInPropertyPage("Disable shadows", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "disableShadows", null);
__decorate([
    editableInPropertyPage("Disable image processing", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "renderInLinearSpace", null);
__decorate([
    editableInPropertyPage("Do not change aspect ratio", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "doNotChangeAspectRatio", null);
__decorate([
    editableInPropertyPage("Enable clustered lights", 0 /* PropertyTypeForEdition.Boolean */, "PROPERTIES")
], NodeRenderGraphBaseObjectRendererBlock.prototype, "enableClusteredLights", null);
//# sourceMappingURL=baseObjectRendererBlock.js.map