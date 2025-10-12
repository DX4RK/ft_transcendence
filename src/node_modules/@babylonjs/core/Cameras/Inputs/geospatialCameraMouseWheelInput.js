import { CameraInputTypes } from "../../Cameras/cameraInputsManager.js";
import { BaseCameraMouseWheelInput } from "./BaseCameraMouseWheelInput.js";
/**
 * @experimental
 * Manage the mouse wheel inputs to control a geospatial camera. As this feature is experimental the API will evolve
 */
export class GeospatialCameraMouseWheelInput extends BaseCameraMouseWheelInput {
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName() {
        return "GeospatialCameraMouseWheelInput";
    }
    checkInputs() {
        this.camera._perFrameZoom = this._wheelDeltaY;
        super.checkInputs();
    }
}
CameraInputTypes["GeospatialCameraMouseWheelInput"] = GeospatialCameraMouseWheelInput;
//# sourceMappingURL=geospatialCameraMouseWheelInput.js.map