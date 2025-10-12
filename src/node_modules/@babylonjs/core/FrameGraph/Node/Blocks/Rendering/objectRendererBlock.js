import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeRenderGraphBaseObjectRendererBlock } from "./baseObjectRendererBlock.js";
/**
 * Block that render objects to a render target
 */
export class NodeRenderGraphObjectRendererBlock extends NodeRenderGraphBaseObjectRendererBlock {
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "NodeRenderGraphObjectRendererBlock";
    }
}
RegisterClass("BABYLON.NodeRenderGraphObjectRendererBlock", NodeRenderGraphObjectRendererBlock);
//# sourceMappingURL=objectRendererBlock.js.map