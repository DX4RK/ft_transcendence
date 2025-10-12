import { FlowGraphBlock, type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import type { FlowGraphContext } from "../../../flowGraphContext.js";
import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection.js";
/**
 * A block that outputs elements from the context
 */
export declare class FlowGraphContextBlock extends FlowGraphBlock {
    /**
     * Output connection: The user variables from the context
     */
    readonly userVariables: FlowGraphDataConnection<FlowGraphContext["userVariables"]>;
    /**
     * Output connection: The execution id from the context
     */
    readonly executionId: FlowGraphDataConnection<FlowGraphContext["executionId"]>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    serialize(serializationObject?: any): void;
    getClassName(): string;
}
