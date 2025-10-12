import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeBoolean } from "../../flowGraphRichTypes.js";
const CacheName = "cachedOperationValue";
const CacheExecIdName = "cachedExecutionId";
/**
 * A block that will cache the result of an operation and deliver it as an output.
 */
export class FlowGraphCachedOperationBlock extends FlowGraphBlock {
    constructor(outputRichType, config) {
        super(config);
        this.value = this.registerDataOutput("value", outputRichType);
        this.isValid = this.registerDataOutput("isValid", RichTypeBoolean);
    }
    _updateOutputs(context) {
        const cachedExecutionId = context._getExecutionVariable(this, CacheExecIdName, -1);
        const cachedValue = context._getExecutionVariable(this, CacheName, null);
        if (cachedValue !== undefined && cachedValue !== null && cachedExecutionId === context.executionId) {
            this.isValid.setValue(true, context);
            this.value.setValue(cachedValue, context);
        }
        else {
            try {
                const calculatedValue = this._doOperation(context);
                if (calculatedValue === undefined || calculatedValue === null) {
                    this.isValid.setValue(false, context);
                    return;
                }
                context._setExecutionVariable(this, CacheName, calculatedValue);
                context._setExecutionVariable(this, CacheExecIdName, context.executionId);
                this.value.setValue(calculatedValue, context);
                this.isValid.setValue(true, context);
            }
            catch (e) {
                this.isValid.setValue(false, context);
            }
        }
    }
}
//# sourceMappingURL=flowGraphCachedOperationBlock.js.map