import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
/**
 * Block used to update the angle of a particle
 */
export class UpdateAngleBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateAngleBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("angle", NodeParticleBlockConnectionPointTypes.Float);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the angle input component
     */
    get angle() {
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
        return "UpdateAngleBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        this.output._storedValue = system;
        if (!this.angle.isConnected) {
            return;
        }
        const processAngle = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.angle = this.angle.getConnectedValue(state);
        };
        const angleProcessing = {
            process: processAngle,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(angleProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = angleProcessing;
        }
    }
}
RegisterClass("BABYLON.UpdateAngleBlock", UpdateAngleBlock);
//# sourceMappingURL=updateAngleBlock.js.map