import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { Vector3 } from "../../../../Maths/math.vector.js";
const ToAttractor = Vector3.Zero();
const Force = Vector3.Zero();
const ScaledForce = Vector3.Zero();
/**
 * Block used to update particle position based on an attractor
 */
export class UpdateAttractorBlock extends NodeParticleBlock {
    /**
     * Create a new UpdateAttractorBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("attractor", NodeParticleBlockConnectionPointTypes.Vector3, true, Vector3.Zero());
        this.registerInput("strength", NodeParticleBlockConnectionPointTypes.Float, true, 1);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the attractor input component
     */
    get attractor() {
        return this._inputs[1];
    }
    /**
     * Gets the strength input component
     */
    get strength() {
        return this._inputs[2];
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
        return "UpdateAttractorBlock";
    }
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state) {
        const system = this.particle.getConnectedValue(state);
        const processAttractor = (particle) => {
            const attractorPosition = this.attractor.getConnectedValue(state);
            const strength = this.strength.getConnectedValue(state);
            attractorPosition.subtractToRef(particle.position, ToAttractor);
            const distanceSquared = ToAttractor.lengthSquared() + 1; // Avoid going under 1.0
            ToAttractor.normalize().scaleToRef(strength / distanceSquared, Force);
            Force.scaleToRef(system._tempScaledUpdateSpeed, ScaledForce);
            particle.direction.addInPlace(ScaledForce); // Update particle velocity
        };
        const attractorProcessing = {
            process: processAttractor,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(attractorProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = attractorProcessing;
        }
        this.output._storedValue = system;
    }
}
RegisterClass("BABYLON.UpdateAttractorBlock", UpdateAttractorBlock);
//# sourceMappingURL=updateAttractorBlock.js.map