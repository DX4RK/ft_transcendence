import { FlowGraphAsyncExecutionBlock } from "./flowGraphAsyncExecutionBlock.js";
/**
 * A type of block that listens to an event observable and activates
 * its output signal when the event is triggered.
 */
export class FlowGraphEventBlock extends FlowGraphAsyncExecutionBlock {
    constructor() {
        super(...arguments);
        /**
         * the priority of initialization of this block.
         * For example, scene start should have a negative priority because it should be initialized last.
         */
        this.initPriority = 0;
        /**
         * The type of the event
         */
        this.type = "NoTrigger" /* FlowGraphEventType.NoTrigger */;
    }
    /**
     * @internal
     */
    _execute(context) {
        context._notifyExecuteNode(this);
        this.done._activateSignal(context);
    }
}
//# sourceMappingURL=flowGraphEventBlock.js.map