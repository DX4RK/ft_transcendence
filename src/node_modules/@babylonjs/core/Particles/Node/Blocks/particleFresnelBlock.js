import { RegisterClass } from "../../../Misc/typeStore.js";
import { Vector3 } from "../../../Maths/math.vector.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
/**
 * Block used to compute the fresnel term
 */
export class ParticleFresnelBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleFresnelBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this.registerInput("view", NodeParticleBlockConnectionPointTypes.Vector3);
        this.registerInput("normal", NodeParticleBlockConnectionPointTypes.Vector3);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleFresnelBlock";
    }
    /**
     * Gets the view input component
     */
    get view() {
        return this._inputs[0];
    }
    /**
     * Gets the normal input component
     */
    get normal() {
        return this._inputs[1];
    }
    /**
     * Gets the gradient operand input component
     */
    get gradient() {
        return this._inputs[2];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build() {
        if (!this.view.isConnected || !this.normal.isConnected) {
            this.output._storedFunction = null;
            this.output._storedValue = null;
            return;
        }
        this.output._storedFunction = (state) => {
            const view = this.view.getConnectedValue(state);
            const normal = this.normal.getConnectedValue(state);
            const f0 = 0.04; // base reflectance at normal incidence (e.g. 0.04 for dielectrics)
            const nLen = normal.length();
            const vLen = view.length();
            // Guard against zero-length inputs
            if (nLen < 1e-8 || vLen < 1e-8) {
                return f0;
            }
            const cosTheta = Math.min(Math.max(Vector3.Dot(normal, view) / (nLen * vLen), 0.0), 1.0);
            // Schlick approximation
            const oneMinusCos = 1.0 - cosTheta;
            return f0 + (1.0 - f0) * Math.pow(oneMinusCos, 5.0);
        };
    }
}
RegisterClass("BABYLON.ParticleFresnelBlock", ParticleFresnelBlock);
//# sourceMappingURL=particleFresnelBlock.js.map