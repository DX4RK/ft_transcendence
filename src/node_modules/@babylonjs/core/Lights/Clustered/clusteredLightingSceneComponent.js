import { SceneComponentConstants } from "../../sceneComponent.js";
import { ClusteredLightContainer } from "./clusteredLightContainer.js";
import { LightConstants } from "../lightConstants.js";
/**
 * A scene component required for running the clustering step in clustered lights
 */
export class ClusteredLightingSceneComponent {
    /**
     * Creates a new scene component.
     * @param scene The scene the component belongs to
     */
    constructor(scene) {
        /**
         * The name of the component. Each component must have a unique name.
         */
        this.name = SceneComponentConstants.NAME_CLUSTEREDLIGHTING;
        this._gatherActiveCameraRenderTargets = (renderTargets) => {
            for (const light of this.scene.lights) {
                if (light.getTypeID() === LightConstants.LIGHTTYPEID_CLUSTERED_CONTAINER && light.isSupported) {
                    renderTargets.push(light._updateBatches());
                }
            }
        };
        this.scene = scene;
    }
    /**
     * Disposes the component and the associated resources.
     */
    dispose() { }
    /**
     * Rebuilds the elements related to this component in case of
     * context lost for instance.
     */
    rebuild() { }
    /**
     * Register the component to one instance of a scene.
     */
    register() {
        this.scene._gatherActiveCameraRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERACTIVECAMERARENDERTARGETS_CLUSTEREDLIGHTING, this, this._gatherActiveCameraRenderTargets);
    }
}
ClusteredLightContainer._SceneComponentInitialization = (scene) => {
    if (!scene._getComponent(SceneComponentConstants.NAME_CLUSTEREDLIGHTING)) {
        scene._addComponent(new ClusteredLightingSceneComponent(scene));
    }
};
//# sourceMappingURL=clusteredLightingSceneComponent.js.map