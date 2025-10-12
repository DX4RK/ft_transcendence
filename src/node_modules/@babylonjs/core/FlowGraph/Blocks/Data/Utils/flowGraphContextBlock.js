import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny, RichTypeNumber } from "../../../flowGraphRichTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that outputs elements from the context
 */
export class FlowGraphContextBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.userVariables = this.registerDataOutput("userVariables", RichTypeAny);
        this.executionId = this.registerDataOutput("executionId", RichTypeNumber);
    }
    _updateOutputs(context) {
        this.userVariables.setValue(context.userVariables, context);
        this.executionId.setValue(context.executionId, context);
    }
    serialize(serializationObject) {
        super.serialize(serializationObject);
    }
    getClassName() {
        return "FlowGraphContextBlock" /* FlowGraphBlockNames.Context */;
    }
}
RegisterClass("FlowGraphContextBlock" /* FlowGraphBlockNames.Context */, FlowGraphContextBlock);
//# sourceMappingURL=flowGraphContextBlock.js.map