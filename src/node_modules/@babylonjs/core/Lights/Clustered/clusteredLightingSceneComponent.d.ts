import type { Scene } from "../../scene.js";
import type { ISceneComponent } from "../../sceneComponent.js";
/**
 * A scene component required for running the clustering step in clustered lights
 */
export declare class ClusteredLightingSceneComponent implements ISceneComponent {
    /**
     * The name of the component. Each component must have a unique name.
     */
    name: string;
    /**
     * The scene the component belongs to.
     */
    scene: Scene;
    /**
     * Creates a new scene component.
     * @param scene The scene the component belongs to
     */
    constructor(scene: Scene);
    /**
     * Disposes the component and the associated resources.
     */
    dispose(): void;
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild(): void;
    /**
     * Register the component to one instance of a scene.
     */
    register(): void;
    private _gatherActiveCameraRenderTargets;
}
