import { NodeParticleBlock } from "../nodeParticleBlock.js";
import type { NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
/**
 * Block used to compute the fresnel term
 */
export declare class ParticleFresnelBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleFresnelBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the view input component
     */
    get view(): NodeParticleConnectionPoint;
    /**
     * Gets the normal input component
     */
    get normal(): NodeParticleConnectionPoint;
    /**
     * Gets the gradient operand input component
     */
    get gradient(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(): void;
}
