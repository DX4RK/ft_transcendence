import type { Effect } from "../../../effect.js";
import { ImageSourceBlock } from "./imageSourceBlock.js";
import type { Nullable } from "../../../../types.js";
import type { Texture } from "../../../Textures/texture.js";
import type { NodeMaterial } from "../../nodeMaterial.js";
/**
 * Block used to provide an depth texture for a TextureBlock
 */
export declare class DepthSourceBlock extends ImageSourceBlock {
    /**
     * Creates a new DepthSourceBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets or sets the texture associated with the node
     */
    get texture(): Nullable<Texture>;
    set texture(texture: Nullable<Texture>);
    bind(effect: Effect, nodeMaterial: NodeMaterial): void;
    isReady(): boolean;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
}
