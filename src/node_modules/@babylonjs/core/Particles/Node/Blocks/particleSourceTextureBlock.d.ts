import { NodeParticleBlock } from "../nodeParticleBlock.js";
import type { NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import type { NodeParticleBuildState } from "../nodeParticleBuildState.js";
import type { Nullable } from "../../../types.js";
import type { BaseTexture } from "../../../Materials/Textures/baseTexture.js";
/**
 * Block used to provide a texture for particles in a particle system
 */
export declare class ParticleTextureSourceBlock extends NodeParticleBlock {
    private _url;
    private _textureDataUrl;
    private _sourceTexture;
    private _cachedData;
    /**
     * Indicates if the texture data should be serialized as a base64 string.
     */
    serializedCachedData: boolean;
    /**
     * Gets or sets the URL of the texture to be used by this block.
     */
    get url(): string;
    set url(value: string);
    /**
     * Gets or sets the data URL of the texture to be used by this block.
     * This is a base64 encoded string representing the texture data.
     */
    get textureDataUrl(): string;
    set textureDataUrl(value: string);
    /**
     * Directly sets the texture to be used by this block.
     * This value will not be serialized.
     */
    set sourceTexture(value: Nullable<BaseTexture>);
    /**
     * Create a new ParticleTextureSourceBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the texture output component
     */
    get texture(): NodeParticleConnectionPoint;
    /**
     * Gets the texture content as a promise
     * @returns a promise that resolves to the texture content, including width, height, and pixel data
     */
    extractTextureContentAsync(): Promise<{
        width: number;
        height: number;
        data: Uint8ClampedArray;
    } | null>;
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state: NodeParticleBuildState): void;
    serialize(): any;
    _deserialize(serializationObject: any): void;
    dispose(): void;
}
