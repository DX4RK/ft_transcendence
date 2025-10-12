import { __decorate } from "../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
export var ParticleLocalVariableBlockScope;
(function (ParticleLocalVariableBlockScope) {
    ParticleLocalVariableBlockScope[ParticleLocalVariableBlockScope["Particle"] = 0] = "Particle";
    ParticleLocalVariableBlockScope[ParticleLocalVariableBlockScope["Loop"] = 1] = "Loop";
})(ParticleLocalVariableBlockScope || (ParticleLocalVariableBlockScope = {}));
/**
 * Defines a block used to store local values
 * #A1OS53#5
 */
export class ParticleLocalVariableBlock extends NodeParticleBlock {
    /**
     * Create a new ParticleLocalVariableBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets the scope used by the block
         */
        this.scope = ParticleLocalVariableBlockScope.Particle;
        this._isDebug = true;
        this.registerInput("input", NodeParticleBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.FloatGradient);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Vector2Gradient);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Vector3Gradient);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Color4Gradient);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.System);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Particle);
        this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Texture);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleLocalVariableBlock";
    }
    /**
     * Gets the input component
     */
    get input() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build(state) {
        if (!this.input.isConnected) {
            this.output._storedFunction = null;
            this.output._storedValue = null;
            return;
        }
        let storedValue = null;
        let localId = -1;
        const func = (state) => {
            if (!state.particleContext && !state.systemContext) {
                storedValue = null;
                return null;
            }
            const id = (this.scope === ParticleLocalVariableBlockScope.Particle ? state.particleContext?.id : state.systemContext?.getScene().getFrameId()) || -1;
            if (localId !== id) {
                localId = id;
                storedValue = null;
            }
            if (storedValue === null) {
                storedValue = this.input.getConnectedValue(state);
            }
            return storedValue;
        };
        if (this.output.isConnected) {
            this.output._storedFunction = func;
        }
        else {
            this.output._storedValue = func(state);
        }
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.scope = this.scope;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.scope = serializationObject.scope;
    }
}
__decorate([
    editableInPropertyPage("Scope", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
        embedded: true,
        notifiers: { rebuild: true },
        options: [
            { label: "Particle", value: ParticleLocalVariableBlockScope.Particle },
            { label: "Loop", value: ParticleLocalVariableBlockScope.Loop },
        ],
    })
], ParticleLocalVariableBlock.prototype, "scope", void 0);
RegisterClass("BABYLON.ParticleLocalVariableBlock", ParticleLocalVariableBlock);
//# sourceMappingURL=particleLocalVariableBlock.js.map