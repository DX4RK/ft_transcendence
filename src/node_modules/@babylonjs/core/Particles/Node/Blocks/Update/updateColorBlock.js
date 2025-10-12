import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
/**
 * Block used to update the color of a particle
 */
export class UpdateColorBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateColorBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("color", NodeParticleBlockConnectionPointTypes.Color4);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the color input component
     */
    get color() {
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
        return "UpdateColorBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        this.output._storedValue = system;
        if (!this.color.isConnected) {
            return;
        }
        const processColor = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.color.copyFrom(this.color.getConnectedValue(state));
        };
        const colorProcessing = {
            process: processColor,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(colorProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = colorProcessing;
        }
    }
}
RegisterClass("BABYLON.UpdateColorBlock", UpdateColorBlock);
//# sourceMappingURL=updateColorBlock.js.map