import type { GeospatialCamera } from "../../Cameras/geospatialCamera.js";
import type { IPointerEvent } from "../../Events/deviceInputEvents.js";
import type { PointerTouch } from "../../Events/pointerEvents.js";
import type { Nullable } from "../../types.js";
import { BaseCameraPointersInput } from "./BaseCameraPointersInput.js";
/**
 * @experimental
 * Geospatial camera inputs can simulate dragging the globe around or tilting the camera around some point on the globe
 * The input will update the camera's localTranslation or localRotation values, and the camera is responsible for using these updates to calculate viewMatrix appropriately
 *
 * As of right now, the camera correction logic (to keep the camera geospatially oriented around the globe) is happening within the camera class when calculating viewmatrix
 * As this is experimental, it is possible we move that correction step to live within the input class (to enable non-corrected translations in the future), say if we want to allow the camera to move outside of the globe's orbit
 *
 * Left mouse button: drag globe
 * Middle mouse button: tilt globe around cursor location
 * Right mouse button: tilt globe around center of screen
 *
 */
export declare class GeospatialCameraPointersInput extends BaseCameraPointersInput {
    camera: GeospatialCamera;
    /**
     * Mouse sensitivity for rotation (lower = more sensitive)
     */
    angularSensibility: number;
    private _dragPlane;
    private _dragPlaneNormal;
    private _dragPlaneOriginPoint;
    private _dragPlaneHitPoint;
    private _dragPlaneOffsetVector;
    private _hitPointRadius?;
    getClassName(): string;
    onButtonDown(evt: IPointerEvent): void;
    onTouch(point: Nullable<PointerTouch>, offsetX: number, offsetY: number): void;
    onButtonUp(_evt: IPointerEvent): void;
    /**
     * The DragPlaneOffsetVector represents the vector between the dragPlane hit point and the dragPlane origin point.
     * As the drag movement occurs, we will continuously recalculate this vector. The delta between the offsetVectors is the delta we will apply to the camera's localtranslation
     * @param hitPointRadius The distance between the world origin (center of globe) and the initial drag hit point
     * @param ray The ray from the camera to the new cursor location
     * @param ref The offset vector between the drag plane's hitPoint and originPoint
     */
    private _recalculateDragPlaneOffsetVectorToRef;
    private _handleDrag;
    private _handleTilt;
}
