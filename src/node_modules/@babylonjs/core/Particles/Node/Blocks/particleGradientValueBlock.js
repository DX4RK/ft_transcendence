import { __decorate } from "../../../tslib.es6.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
/**
 * Block used to define a gradient entry for a gradient block
 */
export class ParticleGradientValueBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleGradientEntryBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets the epsilon value used for comparison
         */
        this.reference = 0;
        this.registerInput("value", NodeParticleBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
        this._outputs[0]._typeConnectionSourceTranslation = (type) => {
            switch (type) {
                case NodeParticleBlockConnectionPointTypes.Float:
                    return NodeParticleBlockConnectionPointTypes.FloatGradient;
                case NodeParticleBlockConnectionPointTypes.Vector2:
                    return NodeParticleBlockConnectionPointTypes.Vector2Gradient;
                case NodeParticleBlockConnectionPointTypes.Vector3:
                    return NodeParticleBlockConnectionPointTypes.Vector3Gradient;
                case NodeParticleBlockConnectionPointTypes.Color4:
                    return NodeParticleBlockConnectionPointTypes.Color4Gradient;
            }
            return type;
        };
        this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeParticleBlockConnectionPointTypes.Float |
            NodeParticleBlockConnectionPointTypes.Vector2 |
            NodeParticleBlockConnectionPointTypes.Vector3 |
            NodeParticleBlockConnectionPointTypes.Color4);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleGradientValueBlock";
    }
    /**
     * Gets the value operand input component
     */
    get value() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build() {
        this.output._storedFunction = (state) => {
            return null;
        };
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.reference = this.reference;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.reference = serializationObject.reference;
    }
}
__decorate([
    editableInPropertyPage("Reference", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0, max: 1 })
], ParticleGradientValueBlock.prototype, "reference", void 0);
RegisterClass("BABYLON.ParticleGradientValueBlock", ParticleGradientValueBlock);
//# sourceMappingURL=particleGradientValueBlock.js.map