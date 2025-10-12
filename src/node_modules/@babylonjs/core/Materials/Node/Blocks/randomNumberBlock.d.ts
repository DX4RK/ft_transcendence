import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import type { NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import type { NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import "../../../Shaders/ShadersInclude/helperFunctions.js";
/**
 * Block used to get a random number
 */
export declare class RandomNumberBlock extends NodeMaterialBlock {
    /**
     * Creates a new RandomNumberBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the seed input component
     */
    get seed(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
