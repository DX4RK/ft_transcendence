import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import type { FlowGraphContext } from "../../flowGraphContext.js";
import { FlowGraphBlockNames } from "../flowGraphBlockNames.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
/**
 * Block that triggers when a scene is ready.
 */
export declare class FlowGraphSceneReadyEventBlock extends FlowGraphEventBlock {
    initPriority: number;
    readonly type: FlowGraphEventType;
    _executeEvent(context: FlowGraphContext, _payload: any): boolean;
    _preparePendingTasks(context: FlowGraphContext): void;
    _cancelPendingTasks(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): FlowGraphBlockNames;
}
