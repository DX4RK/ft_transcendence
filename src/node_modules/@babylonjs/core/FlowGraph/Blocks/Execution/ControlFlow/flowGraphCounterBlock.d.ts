import type { FlowGraphContext } from "../../../flowGraphContext.js";
import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection.js";
import type { FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
/**
 * A block that counts the number of times it has been called.
 * Afterwards it activates its out signal.
 */
export declare class FlowGraphCallCounterBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Output connection: The number of times the block has been called.
     */
    readonly count: FlowGraphDataConnection<number>;
    /**
     * Input connection: Resets the counter.
     */
    readonly reset: FlowGraphSignalConnection;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
