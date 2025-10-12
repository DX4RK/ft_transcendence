import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import type { NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import type { NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import type { Nullable } from "../../../../types.js";
import { Texture } from "../../../Textures/texture.js";
import type { Effect } from "../../../effect.js";
import { NodeMaterial } from "../../nodeMaterial.js";
import type { Scene } from "../../../../scene.js";
/**
 * Block used to provide an image for a TextureBlock
 */
export declare class ImageSourceBlock extends NodeMaterialBlock {
    private _samplerName;
    protected _texture: Nullable<Texture>;
    /**
     * Gets or sets the texture associated with the node
     */
    get texture(): Nullable<Texture>;
    set texture(texture: Nullable<Texture>);
    /**
     * Gets the sampler name associated with this image source
     */
    get samplerName(): string;
    /**
     * Creates a new ImageSourceBlock
     * @param name defines the block name
     */
    constructor(name: string);
    bind(effect: Effect, _nodeMaterial: NodeMaterial): void;
    isReady(): boolean;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the output component
     */
    get source(): NodeMaterialConnectionPoint;
    /**
     * Gets the dimension component
     */
    get dimensions(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(ignoreTexture?: boolean): string;
    serialize(ignoreTexture?: boolean): any;
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string, urlRewriter?: (url: string) => string): void;
}
