import type { NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { CurrentScreenBlock } from "./currentScreenBlock.js";
import type { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import type { NodeMaterial } from "../../nodeMaterial.js";
import type { Scene } from "../../../../scene.js";
import type { Nullable } from "../../../../types.js";
import type { BaseTexture } from "../../../Textures/baseTexture.js";
import type { NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
/**
 * Base block used for creating Smart Filter shader blocks for the SFE framework.
 * This block extends the functionality of CurrentScreenBlock, as both are used
 * to represent arbitrary 2D textures to compose, and work similarly.
 */
export declare class SmartFilterTextureBlock extends CurrentScreenBlock {
    private _firstInit;
    /**
     * A boolean indicating whether this block should be the main input for the SFE pipeline.
     * If true, it can be used in SFE for auto-disabling.
     */
    isMainInput: boolean;
    /**
     * Gets the sampler name associated with this texture
     */
    get samplerName(): string;
    /**
     * Gets or sets the texture associated with this block
     */
    get texture(): Nullable<BaseTexture>;
    set texture(value: Nullable<BaseTexture>);
    /**
     * Create a new SmartFilterTextureBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the source input component
     */
    get source(): NodeMaterialConnectionPoint;
    /**
     * Gets a boolean indicating that this block is linked to an ImageSourceBlock
     */
    get hasImageSource(): boolean;
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
    protected _getMainUvName(state: NodeMaterialBuildState): string;
    protected _emitUvAndSampler(state: NodeMaterialBuildState): void;
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    _postBuildBlock(): void;
    serialize(): any;
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
