import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import type { NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to read from a variable within a loop
 */
export declare class StorageReadBlock extends NodeMaterialBlock {
    /**
     * Creates a new StorageReadBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the loop link component
     */
    get loopID(): NodeMaterialConnectionPoint;
    /**
     * Gets the value component
     */
    get value(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
