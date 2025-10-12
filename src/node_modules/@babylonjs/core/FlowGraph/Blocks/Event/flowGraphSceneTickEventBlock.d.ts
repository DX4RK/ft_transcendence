import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import type { FlowGraphContext } from "../../flowGraphContext.js";
import type { FlowGraphDataConnection } from "../../flowGraphDataConnection.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
/**
 * Payload for the scene tick event.
 */
export interface IFlowGraphOnTickEventPayload {
    /**
     * the time in seconds since the scene started.
     */
    timeSinceStart: number;
    /**
     * the time in seconds since the last frame.
     */
    deltaTime: number;
}
/**
 * Block that triggers on scene tick (before each render).
 */
export declare class FlowGraphSceneTickEventBlock extends FlowGraphEventBlock {
    /**
     * the time in seconds since the scene started.
     */
    readonly timeSinceStart: FlowGraphDataConnection<number>;
    /**
     * the time in seconds since the last frame.
     */
    readonly deltaTime: FlowGraphDataConnection<number>;
    readonly type: FlowGraphEventType;
    constructor();
    /**
     * @internal
     */
    _preparePendingTasks(_context: FlowGraphContext): void;
    /**
     * @internal
     */
    _executeEvent(context: FlowGraphContext, payload: IFlowGraphOnTickEventPayload): boolean;
    /**
     * @internal
     */
    _cancelPendingTasks(_context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
