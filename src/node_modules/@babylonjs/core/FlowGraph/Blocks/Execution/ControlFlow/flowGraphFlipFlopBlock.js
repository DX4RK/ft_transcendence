import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { RichTypeBoolean } from "../../../flowGraphRichTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * This block flip flops between two outputs.
 */
export class FlowGraphFlipFlopBlock extends FlowGraphExecutionBlock {
    constructor(config) {
        super(config);
        this.onOn = this._registerSignalOutput("onOn");
        this.onOff = this._registerSignalOutput("onOff");
        this.value = this.registerDataOutput("value", RichTypeBoolean);
    }
    _execute(context, _callingSignal) {
        let value = context._getExecutionVariable(this, "value", typeof this.config?.startValue === "boolean" ? !this.config.startValue : false);
        value = !value;
        context._setExecutionVariable(this, "value", value);
        this.value.setValue(value, context);
        if (value) {
            this.onOn._activateSignal(context);
        }
        else {
            this.onOff._activateSignal(context);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphFlipFlopBlock" /* FlowGraphBlockNames.FlipFlop */;
    }
}
RegisterClass("FlowGraphFlipFlopBlock" /* FlowGraphBlockNames.FlipFlop */, FlowGraphFlipFlopBlock);
//# sourceMappingURL=flowGraphFlipFlopBlock.js.map