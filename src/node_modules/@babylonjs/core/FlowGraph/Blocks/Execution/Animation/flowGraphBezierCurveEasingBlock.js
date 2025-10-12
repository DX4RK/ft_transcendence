import { BezierCurveEase } from "../../../../Animations/easing.js";
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny, RichTypeNumber, RichTypeVector2 } from "../../../flowGraphRichTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * An easing block that generates a BezierCurveEase easingFunction object based on the data provided.
 */
export class FlowGraphBezierCurveEasingBlock extends FlowGraphBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        /**
         * Internal cache of reusable easing functions.
         * key is type-mode-properties
         */
        this._easingFunctions = {};
        this.mode = this.registerDataInput("mode", RichTypeNumber, 0);
        this.controlPoint1 = this.registerDataInput("controlPoint1", RichTypeVector2);
        this.controlPoint2 = this.registerDataInput("controlPoint2", RichTypeVector2);
        this.easingFunction = this.registerDataOutput("easingFunction", RichTypeAny);
    }
    _updateOutputs(context) {
        const mode = this.mode.getValue(context);
        const controlPoint1 = this.controlPoint1.getValue(context);
        const controlPoint2 = this.controlPoint2.getValue(context);
        if (mode === undefined) {
            return;
        }
        const key = `${mode}-${controlPoint1.x}-${controlPoint1.y}-${controlPoint2.x}-${controlPoint2.y}`;
        if (!this._easingFunctions[key]) {
            const easing = new BezierCurveEase(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y);
            easing.setEasingMode(mode);
            this._easingFunctions[key] = easing;
        }
        this.easingFunction.setValue(this._easingFunctions[key], context);
    }
    getClassName() {
        return "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */;
    }
}
RegisterClass("FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */, FlowGraphBezierCurveEasingBlock);
//# sourceMappingURL=flowGraphBezierCurveEasingBlock.js.map