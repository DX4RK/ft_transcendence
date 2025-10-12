import type { NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { BaseMathBlock } from "./baseMathBlock.js";
/**
 * Block used to divide 2 vectors
 */
export declare class DivideBlock extends BaseMathBlock {
    /**
     * Creates a new DivideBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
