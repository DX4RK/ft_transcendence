import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import type { NodeGeometryConnectionPoint } from "../nodeGeometryBlockConnectionPoint.js";
import type { NodeGeometryBuildState } from "../nodeGeometryBuildState.js";
/**
 * Block used to normalize vectors
 */
export declare class NormalizeVectorBlock extends NodeGeometryBlock {
    /**
     * Creates a new NormalizeVectorBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input component
     */
    get input(): NodeGeometryConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeGeometryConnectionPoint;
    protected _buildBlock(state: NodeGeometryBuildState): void;
}
