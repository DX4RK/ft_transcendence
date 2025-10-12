import { __decorate } from "../../../../tslib.es6.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { FlowMap } from "../../../flowMap.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
/**
 * Block used to update particle position based on a flow map
 */
export class UpdateFlowMapBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateFlowMapBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets the strenght of the flow map effect
         */
        this.strength = 1;
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("flowMap", NodeParticleBlockConnectionPointTypes.Texture);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the flowMap input component
     */
    get flowMap() {
        return this._inputs[1];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "UpdateFlowMapBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        const scene = state.scene;
        const flowMapTexture = this.flowMap.connectedPoint?.ownerBlock;
        let flowMap;
        // eslint-disable-next-line github/no-then
        void flowMapTexture.extractTextureContentAsync().then((textureContent) => {
            if (!textureContent) {
                return;
            }
            flowMap = new FlowMap(textureContent.width, textureContent.height, textureContent.data);
        });
        const processFlowMap = (particle) => {
            const matrix = scene.getTransformMatrix();
            if (!flowMap) {
                // If the flow map is not ready, we skip processing
                return;
            }
            flowMap._processParticle(particle, this.strength * system._tempScaledUpdateSpeed, matrix);
        };
        const flowMapProcessing = {
            process: processFlowMap,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(flowMapProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = flowMapProcessing;
        }
        this.output._storedValue = system;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.strength = this.strength;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.strength = serializationObject.strength;
    }
}
__decorate([
    editableInPropertyPage("strength", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })
], UpdateFlowMapBlock.prototype, "strength", void 0);
RegisterClass("BABYLON.UpdateFlowMapBlock", UpdateFlowMapBlock);
//# sourceMappingURL=updateFlowMapBlock.js.map