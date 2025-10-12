import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import type { NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import type { Mesh } from "../../../../Meshes/mesh.js";
import type { Effect } from "../../../effect.js";
import type { NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import type { AbstractMesh } from "../../../../Meshes/abstractMesh.js";
import type { NodeMaterial, NodeMaterialDefines } from "../../nodeMaterial.js";
/**
 * Block used to add support for scene fog
 */
export declare class FogBlock extends NodeMaterialBlock {
    private _fogDistanceName;
    private _fogParameters;
    /**
     * Create a new FogBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the world position input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the view input component
     */
    get view(): NodeMaterialConnectionPoint;
    /**
     * Gets the color input component
     */
    get input(): NodeMaterialConnectionPoint;
    /**
     * Gets the fog color input component
     */
    get fogColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
