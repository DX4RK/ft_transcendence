import { FlowGraphBlock } from "../../flowGraphBlock.js";
import type { FlowGraphContext } from "../../flowGraphContext.js";
import type { FlowGraphDataConnection } from "../../flowGraphDataConnection.js";
import { Vector3 } from "../../../Maths/math.vector.js";
import type { TransformNode } from "../../../Meshes/transformNode.js";
import type { IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
/**
 * This blocks transforms a vector from one coordinate system to another.
 */
export declare class FlowGraphTransformCoordinatesSystemBlock extends FlowGraphBlock {
    /**
     * Input connection: The source coordinate system.
     */
    readonly sourceSystem: FlowGraphDataConnection<TransformNode>;
    /**
     * Input connection: The destination coordinate system.
     */
    readonly destinationSystem: FlowGraphDataConnection<TransformNode>;
    /**
     * Input connection: The coordinates to transform.
     */
    readonly inputCoordinates: FlowGraphDataConnection<Vector3>;
    /**
     * Output connection: The transformed coordinates.
     */
    readonly outputCoordinates: FlowGraphDataConnection<Vector3>;
    /**
     * Creates a new FlowGraphCoordinateTransformBlock
     * @param config optional configuration for this block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(_context: FlowGraphContext): void;
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName(): string;
}
