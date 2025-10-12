import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { RichTypeNumber } from "../../flowGraphRichTypes.js";
/**
 * Block that triggers on scene tick (before each render).
 */
export class FlowGraphSceneTickEventBlock extends FlowGraphEventBlock {
    constructor() {
        super();
        this.type = "SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */;
        this.timeSinceStart = this.registerDataOutput("timeSinceStart", RichTypeNumber);
        this.deltaTime = this.registerDataOutput("deltaTime", RichTypeNumber);
    }
    /**
     * @internal
     */
    _preparePendingTasks(_context) {
        // no-op
    }
    /**
     * @internal
     */
    _executeEvent(context, payload) {
        this.timeSinceStart.setValue(payload.timeSinceStart, context);
        this.deltaTime.setValue(payload.deltaTime, context);
        this._execute(context);
        return true;
    }
    /**
     * @internal
     */
    _cancelPendingTasks(_context) {
        // no-op
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSceneTickEventBlock" /* FlowGraphBlockNames.SceneTickEvent */;
    }
}
RegisterClass("FlowGraphSceneTickEventBlock" /* FlowGraphBlockNames.SceneTickEvent */, FlowGraphSceneTickEventBlock);
//# sourceMappingURL=flowGraphSceneTickEventBlock.js.map