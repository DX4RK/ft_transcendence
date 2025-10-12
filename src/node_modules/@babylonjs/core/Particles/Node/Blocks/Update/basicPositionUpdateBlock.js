import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
/**
 * Block used to provide the basic update functionality for particles.
 */
export class BasicPositionUpdateBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateScaleBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
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
        return "BasicPositionUpdateBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        const processPosition = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            particle.direction.scaleToRef(system._directionScale, system._scaledDirection);
            particle.position.addInPlace(system._scaledDirection);
        };
        const positionProcessing = {
            process: processPosition,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(positionProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = positionProcessing;
        }
        this.output._storedValue = system;
    }
}
RegisterClass("BABYLON.BasicPositionUpdateBlock", BasicPositionUpdateBlock);
//# sourceMappingURL=basicPositionUpdateBlock.js.map