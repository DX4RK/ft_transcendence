import type { InternalTexture } from "../../Materials/Textures/internalTexture.js";
import type { IColor4Like } from "../../Maths/math.like.js";
import type { VertexBuffer } from "../../Buffers/buffer.js";
import type { Nullable } from "../../types.js";
import type { WebGPUEngine } from "../webgpuEngine.js";
import "../../ShadersWGSL/clearQuad.vertex.js";
import "../../ShadersWGSL/clearQuad.fragment.js";
/** @internal */
export declare class WebGPUClearQuad {
    private _device;
    private _engine;
    private _cacheRenderPipeline;
    private _effect;
    private _bindGroups;
    private _depthTextureFormat;
    private _bundleCache;
    private _keyTemp;
    setDepthStencilFormat(format: GPUTextureFormat | undefined): void;
    setColorFormat(format: GPUTextureFormat | null): void;
    setMRTAttachments(attachments: number[], textureArray: InternalTexture[], textureCount: number): void;
    constructor(device: GPUDevice, engine: WebGPUEngine, emptyVertexBuffer: VertexBuffer);
    clear(renderPass: Nullable<GPURenderPassEncoder>, clearColor?: Nullable<IColor4Like>, clearDepth?: boolean, clearStencil?: boolean, sampleCount?: number): Nullable<GPURenderBundle>;
}
