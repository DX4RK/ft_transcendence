import type { FrameGraph, FrameGraphTextureHandle, FrameGraphRenderPass } from "../../../index.js";
import { ThinBloomMergePostProcess } from "../../../PostProcesses/thinBloomMergePostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * @internal
 */
export declare class FrameGraphBloomMergeTask extends FrameGraphPostProcessTask {
    blurTexture: FrameGraphTextureHandle;
    readonly postProcess: ThinBloomMergePostProcess;
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinBloomMergePostProcess);
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}
