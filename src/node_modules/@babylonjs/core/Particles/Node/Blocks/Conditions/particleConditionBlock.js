import { __decorate } from "../../../../tslib.es6.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { WithinEpsilon } from "../../../../Maths/math.scalar.functions.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
/**
 * Conditions supported by the condition block
 */
export var ParticleConditionBlockTests;
(function (ParticleConditionBlockTests) {
    /** Equal */
    ParticleConditionBlockTests[ParticleConditionBlockTests["Equal"] = 0] = "Equal";
    /** NotEqual */
    ParticleConditionBlockTests[ParticleConditionBlockTests["NotEqual"] = 1] = "NotEqual";
    /** LessThan */
    ParticleConditionBlockTests[ParticleConditionBlockTests["LessThan"] = 2] = "LessThan";
    /** GreaterThan */
    ParticleConditionBlockTests[ParticleConditionBlockTests["GreaterThan"] = 3] = "GreaterThan";
    /** LessOrEqual */
    ParticleConditionBlockTests[ParticleConditionBlockTests["LessOrEqual"] = 4] = "LessOrEqual";
    /** GreaterOrEqual */
    ParticleConditionBlockTests[ParticleConditionBlockTests["GreaterOrEqual"] = 5] = "GreaterOrEqual";
    /** Logical Exclusive OR */
    ParticleConditionBlockTests[ParticleConditionBlockTests["Xor"] = 6] = "Xor";
    /** Logical Or */
    ParticleConditionBlockTests[ParticleConditionBlockTests["Or"] = 7] = "Or";
    /** Logical And */
    ParticleConditionBlockTests[ParticleConditionBlockTests["And"] = 8] = "And";
})(ParticleConditionBlockTests || (ParticleConditionBlockTests = {}));
/**
 * Block used to evaluate a condition and return a true or false value as a float (1 or 0).
 */
export class ParticleConditionBlock extends NodeParticleBlock {
    /**
     * Create a new ParticleConditionBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets the test used by the block
         */
        this.test = ParticleConditionBlockTests.Equal;
        /**
         * Gets or sets the epsilon value used for comparison
         */
        this.epsilon = 0;
        this.registerInput("left", NodeParticleBlockConnectionPointTypes.Float);
        this.registerInput("right", NodeParticleBlockConnectionPointTypes.Float, true, 0);
        this.registerInput("ifTrue", NodeParticleBlockConnectionPointTypes.AutoDetect, true, 1);
        this.registerInput("ifFalse", NodeParticleBlockConnectionPointTypes.AutoDetect, true, 0);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
        this.output._typeConnectionSource = this._inputs[2];
        this.output._defaultConnectionPointType = NodeParticleBlockConnectionPointTypes.Float;
        this._inputs[0].acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Int);
        this._inputs[1].acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Int);
        this._linkConnectionTypes(2, 3);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleConditionBlock";
    }
    /**
     * Gets the left input component
     */
    get left() {
        return this._inputs[0];
    }
    /**
     * Gets the right input component
     */
    get right() {
        return this._inputs[1];
    }
    /**
     * Gets the ifTrue input component
     */
    get ifTrue() {
        return this._inputs[2];
    }
    /**
     * Gets the ifFalse input component
     */
    get ifFalse() {
        return this._inputs[3];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build() {
        const func = (state) => {
            const left = this.left.getConnectedValue(state);
            const right = this.right.getConnectedValue(state);
            let condition = false;
            switch (this.test) {
                case ParticleConditionBlockTests.Equal:
                    condition = WithinEpsilon(left, right, this.epsilon);
                    break;
                case ParticleConditionBlockTests.NotEqual:
                    condition = !WithinEpsilon(left, right, this.epsilon);
                    break;
                case ParticleConditionBlockTests.LessThan:
                    condition = left < right + this.epsilon;
                    break;
                case ParticleConditionBlockTests.GreaterThan:
                    condition = left > right - this.epsilon;
                    break;
                case ParticleConditionBlockTests.LessOrEqual:
                    condition = left <= right + this.epsilon;
                    break;
                case ParticleConditionBlockTests.GreaterOrEqual:
                    condition = left >= right - this.epsilon;
                    break;
                case ParticleConditionBlockTests.Xor:
                    condition = (!!left && !right) || (!left && !!right);
                    break;
                case ParticleConditionBlockTests.Or:
                    condition = !!left || !!right;
                    break;
                case ParticleConditionBlockTests.And:
                    condition = !!left && !!right;
                    break;
            }
            return condition;
        };
        this.output._storedFunction = (state) => {
            if (func(state)) {
                return this.ifTrue.getConnectedValue(state);
            }
            return this.ifFalse.getConnectedValue(state);
        };
    }
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.test = this.test;
        serializationObject.epsilon = this.epsilon;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.test = serializationObject.test;
        if (serializationObject.epsilon !== undefined) {
            this.epsilon = serializationObject.epsilon;
        }
    }
}
__decorate([
    editableInPropertyPage("Test", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
        notifiers: { rebuild: true },
        embedded: true,
        options: [
            { label: "Equal", value: ParticleConditionBlockTests.Equal },
            { label: "NotEqual", value: ParticleConditionBlockTests.NotEqual },
            { label: "LessThan", value: ParticleConditionBlockTests.LessThan },
            { label: "GreaterThan", value: ParticleConditionBlockTests.GreaterThan },
            { label: "LessOrEqual", value: ParticleConditionBlockTests.LessOrEqual },
            { label: "GreaterOrEqual", value: ParticleConditionBlockTests.GreaterOrEqual },
            { label: "Xor", value: ParticleConditionBlockTests.Xor },
            { label: "Or", value: ParticleConditionBlockTests.Or },
            { label: "And", value: ParticleConditionBlockTests.And },
        ],
    })
], ParticleConditionBlock.prototype, "test", void 0);
__decorate([
    editableInPropertyPage("Epsilon", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })
], ParticleConditionBlock.prototype, "epsilon", void 0);
RegisterClass("BABYLON.ParticleConditionBlock", ParticleConditionBlock);
//# sourceMappingURL=particleConditionBlock.js.map