import type { EasingFunction } from "../../../../Animations/easing.js";
import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import type { FlowGraphContext } from "../../../flowGraphContext.js";
import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection.js";
import type { Vector2 } from "../../../../Maths/math.vector.js";
/**
 * An easing block that generates a BezierCurveEase easingFunction object based on the data provided.
 */
export declare class FlowGraphBezierCurveEasingBlock extends FlowGraphBlock {
    /**
     * the configuration of the block
     */
    config?: IFlowGraphBlockConfiguration | undefined;
    /**
     * Input connection: The mode of the easing function.
     * EasingFunction.EASINGMODE_EASEIN, EasingFunction.EASINGMODE_EASEOUT, EasingFunction.EASINGMODE_EASEINOUT
     */
    readonly mode: FlowGraphDataConnection<number>;
    /**
     * Input connection: Control point 1 for bezier curve.
     */
    readonly controlPoint1: FlowGraphDataConnection<Vector2>;
    /**
     * Input connection: Control point 2 for bezier curve.
     */
    readonly controlPoint2: FlowGraphDataConnection<Vector2>;
    /**
     * Output connection: The easing function object.
     */
    readonly easingFunction: FlowGraphDataConnection<EasingFunction>;
    /**
     * Internal cache of reusable easing functions.
     * key is type-mode-properties
     */
    private _easingFunctions;
    constructor(
    /**
     * the configuration of the block
     */
    config?: IFlowGraphBlockConfiguration | undefined);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
