import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import type { NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import type { NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import type { Mesh } from "../../../../Meshes/mesh.js";
import type { Effect } from "../../../effect.js";
import type { NodeMaterial } from "../../nodeMaterial.js";
/**
 * Block used for Reading components of the Gaussian Splatting
 */
export declare class SplatReaderBlock extends NodeMaterialBlock {
    /**
     * Create a new SplatReaderBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the splat index input component
     */
    get splatIndex(): NodeMaterialConnectionPoint;
    /**
     * Gets the splatPosition output component
     */
    get splatPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the splatColor output component
     */
    get splatColor(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
