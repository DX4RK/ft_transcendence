import { NodeParticleBlock } from "../nodeParticleBlock.js";
import type { NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
/**
 * Block used to compute vector length
 */
export declare class ParticleVectorLengthBlock extends NodeParticleBlock {
    /**
     * Creates a new ParticleVectorLengthBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input operand input component
     */
    get input(): NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeParticleConnectionPoint;
    _build(): void;
}
