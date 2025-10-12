import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block that triggers when a scene is ready.
 */
export class FlowGraphSceneReadyEventBlock extends FlowGraphEventBlock {
    constructor() {
        super(...arguments);
        this.initPriority = -1;
        this.type = "SceneReady" /* FlowGraphEventType.SceneReady */;
    }
    _executeEvent(context, _payload) {
        this._execute(context);
        return true;
    }
    _preparePendingTasks(context) {
        // no-op
    }
    _cancelPendingTasks(context) {
        // no-op
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSceneReadyEventBlock" /* FlowGraphBlockNames.SceneReadyEvent */;
    }
}
RegisterClass("FlowGraphSceneReadyEventBlock" /* FlowGraphBlockNames.SceneReadyEvent */, FlowGraphSceneReadyEventBlock);
//# sourceMappingURL=flowGraphSceneReadyEventBlock.js.map