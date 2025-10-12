import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import type { NodeGeometryConnectionPoint } from "../../nodeGeometryBlockConnectionPoint.js";
import type { NodeGeometryBuildState } from "../../nodeGeometryBuildState.js";
/**
 * Block used to get a scaling matrix
 */
export declare class ScalingBlock extends NodeGeometryBlock {
    /**
     * Create a new ScalingBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the scale input component
     */
    get scale(): NodeGeometryConnectionPoint;
    /**
     * Gets the matrix output component
     */
    get matrix(): NodeGeometryConnectionPoint;
    autoConfigure(): void;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
