import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSRBlurPostProcess } from "../../../PostProcesses/thinSSRBlurPostProcess.js";
import { Vector2 } from "../../../Maths/math.vector.js";
/**
 * @internal
 */
export class FrameGraphSSRBlurTask extends FrameGraphPostProcessTask {
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinSSRBlurPostProcess(name, frameGraph.engine, new Vector2(1, 0), 0.03));
    }
    record(skipCreationOfDisabledPasses = false, additionalExecute, additionalBindings) {
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings);
        this.postProcess.textureWidth = this._sourceWidth;
        this.postProcess.textureHeight = this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=ssrBlurTask.js.map