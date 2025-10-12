import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Task used to copy a texture to another texture.
 */
export class FrameGraphCopyToTextureTask extends FrameGraphTask {
    /**
     * Constructs a new FrameGraphCopyToTextureTask.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name, frameGraph) {
        super(name, frameGraph);
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    record() {
        if (this.sourceTexture === undefined || this.targetTexture === undefined) {
            throw new Error(`FrameGraphCopyToTextureTask "${this.name}": sourceTexture and targetTexture are required`);
        }
        this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, this.targetTexture);
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.addDependencies(this.sourceTexture);
        pass.setRenderTarget(this.outputTexture);
        pass.setExecuteFunc((context) => {
            context.copyTexture(this.sourceTexture);
        });
        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setExecuteFunc((_context) => { });
    }
}
//# sourceMappingURL=copyToTextureTask.js.map