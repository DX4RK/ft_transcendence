import { FlowGraphConnection } from "./flowGraphConnection.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Represents a connection point for a signal.
 * When an output point is activated, it will activate the connected input point.
 * When an input point is activated, it will execute the block it belongs to.
 */
export class FlowGraphSignalConnection extends FlowGraphConnection {
    constructor() {
        super(...arguments);
        /**
         * The priority of the signal. Signals with higher priority will be executed first.
         * Set priority before adding the connection as sorting happens only when the connection is added.
         */
        this.priority = 0;
    }
    _isSingularConnection() {
        return false;
    }
    connectTo(point) {
        super.connectTo(point);
        // sort according to priority to handle execution order
        this._connectedPoint.sort((a, b) => b.priority - a.priority);
    }
    /**
     * @internal
     */
    _activateSignal(context) {
        context.logger?.addLogItem({
            action: "ActivateSignal" /* FlowGraphAction.ActivateSignal */,
            className: this._ownerBlock.getClassName(),
            uniqueId: this._ownerBlock.uniqueId,
            payload: {
                connectionType: this.connectionType,
                name: this.name,
            },
        });
        if (this.connectionType === 0 /* FlowGraphConnectionType.Input */) {
            context._notifyExecuteNode(this._ownerBlock);
            this._ownerBlock._execute(context, this);
            context._increaseExecutionId();
        }
        else {
            for (const connectedPoint of this._connectedPoint) {
                connectedPoint._activateSignal(context);
            }
        }
    }
}
RegisterClass("FlowGraphSignalConnection", FlowGraphSignalConnection);
//# sourceMappingURL=flowGraphSignalConnection.js.map