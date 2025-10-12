import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeBoolean, RichTypeAny } from "../../flowGraphRichTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block that returns a value based on a condition.
 */
export class FlowGraphConditionalDataBlock extends FlowGraphBlock {
    /**
     * Creates a new instance of the block
     * @param config optional configuration for this block
     */
    constructor(config) {
        super(config);
        this.condition = this.registerDataInput("condition", RichTypeBoolean);
        this.onTrue = this.registerDataInput("onTrue", RichTypeAny);
        this.onFalse = this.registerDataInput("onFalse", RichTypeAny);
        this.output = this.registerDataOutput("output", RichTypeAny);
    }
    /**
     * @internal
     */
    _updateOutputs(context) {
        // get the value of the condition
        const condition = this.condition.getValue(context);
        // set the value based on the condition truth-ness.
        this.output.setValue(condition ? this.onTrue.getValue(context) : this.onFalse.getValue(context), context);
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphConditionalBlock" /* FlowGraphBlockNames.Conditional */;
    }
}
RegisterClass("FlowGraphConditionalBlock" /* FlowGraphBlockNames.Conditional */, FlowGraphConditionalDataBlock);
//# sourceMappingURL=flowGraphConditionalDataBlock.js.map