import type { Nullable } from "../../types.js";
import type { TextureSize } from "../../Materials/Textures/textureCreationOptions.js";
import { RenderTargetWrapper } from "../renderTargetWrapper.js";
import type { NativeEngine } from "../nativeEngine.js";
import type { NativeFramebuffer } from "./nativeInterfaces.js";
export declare class NativeRenderTargetWrapper extends RenderTargetWrapper {
    readonly _engine: NativeEngine;
    private __framebuffer;
    private __framebufferDepthStencil;
    get _framebuffer(): Nullable<NativeFramebuffer>;
    set _framebuffer(framebuffer: Nullable<NativeFramebuffer>);
    get _framebufferDepthStencil(): Nullable<NativeFramebuffer>;
    set _framebufferDepthStencil(framebufferDepthStencil: Nullable<NativeFramebuffer>);
    constructor(isMulti: boolean, isCube: boolean, size: TextureSize, engine: NativeEngine);
    dispose(disposeOnlyFramebuffers?: boolean): void;
}
