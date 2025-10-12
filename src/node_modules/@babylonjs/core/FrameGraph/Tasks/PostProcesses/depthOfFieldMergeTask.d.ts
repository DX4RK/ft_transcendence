import type { FrameGraph, FrameGraphTextureHandle, FrameGraphRenderPass } from "../../../index.js";
import { ThinDepthOfFieldMergePostProcess } from "../../../PostProcesses/thinDepthOfFieldMergePostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * @internal
 */
export declare class FrameGraphDepthOfFieldMergeTask extends FrameGraphPostProcessTask {
    circleOfConfusionTexture: FrameGraphTextureHandle;
    blurSteps: FrameGraphTextureHandle[];
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinDepthOfFieldMergePostProcess);
    record(skipCreationOfDisabledPasses?: boolean): FrameGraphRenderPass;
}
