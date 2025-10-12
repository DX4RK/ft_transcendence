import type { IObjectInfo, IPathToObjectConverter } from "../ObjectModel/objectModelInterfaces.js";
import type { FlowGraphBlock } from "./flowGraphBlock.js";
import type { FlowGraphContext } from "./flowGraphContext.js";
import type { FlowGraphDataConnection } from "./flowGraphDataConnection.js";
import { FlowGraphInteger } from "./CustomTypes/flowGraphInteger.js";
import type { IObjectAccessor } from "./typeDefinitions.js";
/**
 * @experimental
 * A component that converts a path to an object accessor.
 */
export declare class FlowGraphPathConverterComponent {
    path: string;
    ownerBlock: FlowGraphBlock;
    /**
     * The templated inputs for the provided path.
     */
    readonly templatedInputs: FlowGraphDataConnection<FlowGraphInteger>[];
    constructor(path: string, ownerBlock: FlowGraphBlock);
    /**
     * Get the accessor for the path.
     * @param pathConverter the path converter to use to convert the path to an object accessor.
     * @param context the context to use.
     * @returns the accessor for the path.
     * @throws if the value for a templated input is invalid.
     */
    getAccessor(pathConverter: IPathToObjectConverter<IObjectAccessor>, context: FlowGraphContext): IObjectInfo<IObjectAccessor>;
}
