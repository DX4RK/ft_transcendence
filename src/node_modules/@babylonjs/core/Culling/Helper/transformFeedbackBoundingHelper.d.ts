import type { ThinEngine } from "../../Engines/thinEngine.js";
import type { AbstractMesh } from "../../Meshes/abstractMesh.js";
import type { IBoundingInfoHelperPlatform } from "./IBoundingInfoHelperPlatform.js";
import "../../Shaders/gpuTransform.vertex.js";
import "../../Shaders/gpuTransform.fragment.js";
/** @internal */
export declare class TransformFeedbackBoundingHelper implements IBoundingInfoHelperPlatform {
    private static _Min;
    private static _Max;
    private _engine;
    private _buffers;
    private _effects;
    private _meshList;
    private _meshListCounter;
    /**
     * Creates a new TransformFeedbackBoundingHelper
     * @param engine defines the engine to use
     */
    constructor(engine: ThinEngine);
    /** @internal */
    processAsync(meshes: AbstractMesh | AbstractMesh[]): Promise<void>;
    private _processMeshList;
    private _compute;
    /** @internal */
    registerMeshListAsync(meshes: AbstractMesh | AbstractMesh[]): Promise<void>;
    /** @internal */
    processMeshList(): void;
    /** @internal */
    fetchResultsForMeshListAsync(): Promise<void>;
    /** @internal */
    dispose(): void;
}
