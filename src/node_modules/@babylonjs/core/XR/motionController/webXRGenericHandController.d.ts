import type { IMinimalMotionControllerObject, MotionControllerHandedness } from "./webXRAbstractMotionController.js";
import { WebXRAbstractMotionController } from "./webXRAbstractMotionController.js";
import type { Scene } from "../../scene.js";
import type { AbstractMesh } from "../../Meshes/abstractMesh.js";
/**
 * A generic hand controller class that supports select and a secondary grasp
 */
export declare class WebXRGenericHandController extends WebXRAbstractMotionController {
    profileId: string;
    /**
     * Create a new hand controller object, without loading a controller model
     * @param scene the scene to use to create this controller
     * @param gamepadObject the corresponding gamepad object
     * @param handedness the handedness of the controller
     */
    constructor(scene: Scene, gamepadObject: IMinimalMotionControllerObject, handedness: MotionControllerHandedness);
    protected _getFilenameAndPath(): {
        filename: string;
        path: string;
    };
    protected _getModelLoadingConstraints(): boolean;
    protected _processLoadedModel(_meshes: AbstractMesh[]): void;
    protected _setRootMesh(meshes: AbstractMesh[]): void;
    protected _updateModel(): void;
}
