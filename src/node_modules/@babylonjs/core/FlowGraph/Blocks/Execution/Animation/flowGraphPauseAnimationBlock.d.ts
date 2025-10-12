import type { FlowGraphContext } from "../../../flowGraphContext.js";
import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import type { AnimationGroup } from "../../../../Animations/animationGroup.js";
/**
 * @experimental
 * Block that pauses a running animation
 */
export declare class FlowGraphPauseAnimationBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The animation to pause.
     */
    readonly animationToPause: FlowGraphDataConnection<AnimationGroup>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
