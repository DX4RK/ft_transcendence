import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeAny } from "../../flowGraphRichTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A block that gets the value of a variable.
 * Variables are an stored in the context of the flow graph.
 */
export class FlowGraphGetVariableBlock extends FlowGraphBlock {
    /**
     * Construct a FlowGraphGetVariableBlock.
     * @param config construction parameters
     */
    constructor(config) {
        super(config);
        this.config = config;
        // The output connection has to have the name of the variable.
        this.value = this.registerDataOutput("value", RichTypeAny, config.initialValue);
    }
    /**
     * @internal
     */
    _updateOutputs(context) {
        const variableNameValue = this.config.variable;
        if (context.hasVariable(variableNameValue)) {
            this.value.setValue(context.getVariable(variableNameValue), context);
        }
    }
    /**
     * Serializes this block
     * @param serializationObject the object to serialize to
     */
    serialize(serializationObject) {
        super.serialize(serializationObject);
        serializationObject.config.variable = this.config.variable;
    }
    getClassName() {
        return "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */;
    }
}
RegisterClass("FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */, FlowGraphGetVariableBlock);
//# sourceMappingURL=flowGraphGetVariableBlock.js.map