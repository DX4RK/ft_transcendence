import { __decorate } from "../../../../tslib.es6.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { _TriggerSubEmitter } from "./triggerTools.js";
/**
 * Block used to trigger a particle system based on a condition.
 */
export class ParticleTriggerBlock extends NodeParticleBlock {
    /**
     * Create a new ParticleTriggerBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        this._triggerCount = 0;
        /**
         * Gets or sets the emit rate
         */
        this.limit = 5;
        /**
         * Gets or sets the emit rate
         */
        this.delay = 250;
        this._previousOne = null;
        this.registerInput("input", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerInput("condition", NodeParticleBlockConnectionPointTypes.Float, true, 0);
        this.registerInput("system", NodeParticleBlockConnectionPointTypes.System);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ParticleTriggerBlock";
    }
    /**
     * Gets the input component
     */
    get input() {
        return this._inputs[0];
    }
    /**
     * Gets the condition input component
     */
    get condition() {
        return this._inputs[1];
    }
    /**
     * Gets the target system input component
     */
    get system() {
        return this._inputs[2];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build(state) {
        this._triggerCount = 0;
        const system = this.input.getConnectedValue(state);
        const processCondition = (particle) => {
            state.particleContext = particle;
            state.systemContext = system;
            if (this.condition.getConnectedValue(state) !== 0) {
                if (this.limit === 0 || this._triggerCount < this.limit) {
                    const now = new Date().getTime();
                    if (this._previousOne && now - this._previousOne < this.delay) {
                        return; // Skip if the delay has not passed
                    }
                    this._triggerCount++;
                    this._previousOne = now;
                    // Trigger the target particle system
                    const targetSystem = this.system.getConnectedValue(state);
                    if (targetSystem) {
                        const clone = _TriggerSubEmitter(targetSystem, state.scene, particle.position);
                        clone.onDisposeObservable.addOnce(() => {
                            this._triggerCount--;
                        });
                        system.onDisposeObservable.addOnce(() => {
                            // Clean up the cloned system when the original system is disposed
                            clone.dispose();
                        });
                    }
                }
            }
        };
        const conditionProcessing = {
            process: processCondition,
            previousItem: null,
            nextItem: null,
        };
        if (system._updateQueueStart) {
            _ConnectAtTheEnd(conditionProcessing, system._updateQueueStart);
        }
        else {
            system._updateQueueStart = conditionProcessing;
        }
        this.output._storedValue = system;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.limit = this.limit;
        serializationObject.delay = this.delay;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        if (serializationObject.limit !== undefined) {
            this.limit = serializationObject.limit;
        }
        if (serializationObject.delay !== undefined) {
            this.delay = serializationObject.delay;
        }
    }
    dispose() {
        super.dispose();
        this._triggerCount = 0;
    }
}
__decorate([
    editableInPropertyPage("Max simultaneous", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })
], ParticleTriggerBlock.prototype, "limit", void 0);
__decorate([
    editableInPropertyPage("Delay between calls (ms)", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })
], ParticleTriggerBlock.prototype, "delay", void 0);
RegisterClass("BABYLON.ParticleTriggerBlock", ParticleTriggerBlock);
//# sourceMappingURL=particleTriggerBlock.js.map