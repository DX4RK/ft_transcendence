import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import type { NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import type { NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import type { Effect } from "../../../effect.js";
import type { NodeMaterial, NodeMaterialDefines } from "../../nodeMaterial.js";
import type { Mesh } from "../../../../Meshes/mesh.js";
import type { AbstractMesh } from "../../../../Meshes/abstractMesh.js";
/**
 * Block used to implement clip planes
 */
export declare class ClipPlanesBlock extends NodeMaterialBlock {
    /**
     * Create a new ClipPlanesBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Gets the worldPosition input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    get target(): NodeMaterialBlockTargets;
    set target(value: NodeMaterialBlockTargets);
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
