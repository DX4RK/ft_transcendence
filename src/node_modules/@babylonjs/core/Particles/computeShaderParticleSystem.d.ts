import type { WebGPUEngine } from "../Engines/webgpuEngine.js";
import type { IGPUParticleSystemPlatform } from "./IGPUParticleSystemPlatform.js";
import type { Buffer, VertexBuffer } from "../Buffers/buffer.js";
import type { GPUParticleSystem } from "./gpuParticleSystem.js";
import type { DataArray, Nullable } from "../types.js";
import type { DataBuffer } from "../Buffers/dataBuffer.js";
import { UniformBufferEffectCommonAccessor } from "../Materials/uniformBufferEffectCommonAccessor.js";
import type { Effect } from "../Materials/effect.js";
import "../ShadersWGSL/gpuUpdateParticles.compute.js";
/** @internal */
export declare class ComputeShaderParticleSystem implements IGPUParticleSystemPlatform {
    private _parent;
    private _engine;
    private _updateComputeShader;
    private _simParamsComputeShader;
    private _bufferComputeShader;
    private _renderVertexBuffers;
    /** @internal */
    readonly alignDataInBuffer = true;
    /** @internal */
    constructor(parent: GPUParticleSystem, engine: WebGPUEngine);
    /** @internal */
    contextLost(): void;
    /** @internal */
    isUpdateBufferCreated(): boolean;
    /** @internal */
    isUpdateBufferReady(): boolean;
    /** @internal */
    createUpdateBuffer(defines: string): UniformBufferEffectCommonAccessor;
    /** @internal */
    createVertexBuffers(updateBuffer: Buffer, renderVertexBuffers: {
        [key: string]: VertexBuffer;
    }): void;
    /** @internal */
    createParticleBuffer(data: number[]): DataArray | DataBuffer;
    /** @internal */
    bindDrawBuffers(index: number, effect: Effect, indexBuffer: Nullable<DataBuffer>): void;
    /** @internal */
    preUpdateParticleBuffer(): void;
    /** @internal */
    updateParticleBuffer(index: number, targetBuffer: Buffer, currentActiveCount: number): void;
    /** @internal */
    releaseBuffers(): void;
    /** @internal */
    releaseVertexBuffers(): void;
}
