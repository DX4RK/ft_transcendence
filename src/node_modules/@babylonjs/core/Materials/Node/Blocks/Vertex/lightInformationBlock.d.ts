import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import type { NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import type { NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import type { Nullable } from "../../../../types.js";
import type { Scene } from "../../../../scene.js";
import type { Effect } from "../../../effect.js";
import type { NodeMaterial, NodeMaterialDefines } from "../../nodeMaterial.js";
import type { Mesh } from "../../../../Meshes/mesh.js";
import type { Light } from "../../../../Lights/light.js";
/**
 * Block used to get data information from a light
 */
export declare class LightInformationBlock extends NodeMaterialBlock {
    private _lightDataUniformName;
    private _lightColorUniformName;
    private _lightShadowUniformName;
    private _lightShadowExtraUniformName;
    private _lightTypeDefineName;
    private _forcePrepareDefines;
    /**
     * Gets or sets the light associated with this block
     */
    light: Nullable<Light>;
    /**
     * Creates a new LightInformationBlock
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
     * Gets the direction output component
     */
    get direction(): NodeMaterialConnectionPoint;
    /**
     * Gets the direction output component
     */
    get color(): NodeMaterialConnectionPoint;
    /**
     * Gets the direction output component
     */
    get intensity(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow bias output component
     */
    get shadowBias(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow normal bias output component
     */
    get shadowNormalBias(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow depth scale component
     */
    get shadowDepthScale(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow depth range component
     */
    get shadowDepthRange(): NodeMaterialConnectionPoint;
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    prepareDefines(defines: NodeMaterialDefines): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    serialize(): any;
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
