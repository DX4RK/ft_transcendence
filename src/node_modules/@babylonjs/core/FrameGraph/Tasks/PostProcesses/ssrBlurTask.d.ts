import type { FrameGraph, FrameGraphRenderPass, FrameGraphRenderContext } from "../../../index.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSRBlurPostProcess } from "../../../PostProcesses/thinSSRBlurPostProcess.js";
/**
 * @internal
 */
export declare class FrameGraphSSRBlurTask extends FrameGraphPostProcessTask {
    readonly postProcess: ThinSSRBlurPostProcess;
    constructor(name: string, frameGraph: FrameGraph, thinPostProcess?: ThinSSRBlurPostProcess);
    record(skipCreationOfDisabledPasses?: boolean, additionalExecute?: (context: FrameGraphRenderContext) => void, additionalBindings?: (context: FrameGraphRenderContext) => void): FrameGraphRenderPass;
}
