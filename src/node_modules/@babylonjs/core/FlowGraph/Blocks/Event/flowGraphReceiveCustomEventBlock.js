import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { Tools } from "../../../Misc/tools.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { FlowGraphCoordinator } from "../../flowGraphCoordinator.js";
/**
 * A block that receives a custom event.
 * It saves the event data in the data outputs, based on the provided eventData in the configuration. For example, if the event data is
 * `{ x: { type: RichTypeNumber }, y: { type: RichTypeNumber } }`, the block will have two data outputs: x and y.
 */
export class FlowGraphReceiveCustomEventBlock extends FlowGraphEventBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this.initPriority = 1;
        // use event data to register data outputs
        for (const key in this.config.eventData) {
            this.registerDataOutput(key, this.config.eventData[key].type);
        }
    }
    _preparePendingTasks(context) {
        const observable = context.configuration.coordinator.getCustomEventObservable(this.config.eventId);
        // check if we are not exceeding the max number of events
        if (observable && observable.hasObservers() && observable.observers.length > FlowGraphCoordinator.MaxEventsPerType) {
            this._reportError(context, `FlowGraphReceiveCustomEventBlock: Too many observers for event ${this.config.eventId}. Max is ${FlowGraphCoordinator.MaxEventsPerType}.`);
            return;
        }
        const eventObserver = observable.add((eventData) => {
            const keys = Object.keys(eventData);
            for (const key of keys) {
                this.getDataOutput(key)?.setValue(eventData[key], context);
            }
            this._execute(context);
        });
        context._setExecutionVariable(this, "_eventObserver", eventObserver);
    }
    _cancelPendingTasks(context) {
        const observable = context.configuration.coordinator.getCustomEventObservable(this.config.eventId);
        if (observable) {
            const eventObserver = context._getExecutionVariable(this, "_eventObserver", null);
            observable.remove(eventObserver);
        }
        else {
            Tools.Warn(`FlowGraphReceiveCustomEventBlock: Missing observable for event ${this.config.eventId}`);
        }
    }
    _executeEvent(_context, _payload) {
        return true;
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphReceiveCustomEventBlock" /* FlowGraphBlockNames.ReceiveCustomEvent */;
    }
}
RegisterClass("FlowGraphReceiveCustomEventBlock" /* FlowGraphBlockNames.ReceiveCustomEvent */, FlowGraphReceiveCustomEventBlock);
//# sourceMappingURL=flowGraphReceiveCustomEventBlock.js.map