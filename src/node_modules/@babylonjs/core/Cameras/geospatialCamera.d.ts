import { GeospatialCameraInputsManager } from "./geospatialCameraInputsManager.js";
import { Vector3, Matrix } from "../Maths/math.vector.js";
import { Camera } from "./camera.js";
import type { Scene } from "../scene.js";
import type { MeshPredicate } from "../Culling/ray.core.js";
import type { Nullable } from "../types.js";
type CameraOptions = {
    planetRadius: number;
    minAltitude?: number;
    maxAltitude?: number;
    restingAltitude?: number;
};
/**
 * @experimental
 * This camera's movements are limited to a camera orbiting a globe, and as the API evolves it will introduce conversions between cartesian coordinates and true lat/long/alt
 *
 * Please note this is marked as experimental and the API (including the constructor!) will change until we remove that flag
 *
 * Still TODO:
 * - Pitch/yaw limits, input speeds
 * - ZoomToPoint
 * - Conversion between lat/long/alt and cartesian coordinates
 */
export declare class GeospatialCamera extends Camera {
    inputs: GeospatialCameraInputsManager;
    /** @internal */
    _perFrameGeocentricTranslation: Vector3;
    /** @internal */
    _perFrameGeocentricRotation: Vector3;
    /** @internal */
    _perFrameZoom: number;
    /** If supplied, will be used when picking the globe */
    pickPredicate?: MeshPredicate;
    /**
     * Enables rotation around a specific point, instead of default rotation around center
     * @internal
     */
    _alternateRotationPt: Nullable<Vector3>;
    /** The point on the globe that we are anchoring around. If no alternate rotation point is supplied, this will represent the center of screen*/
    get center(): Vector3;
    private _tempGeocentricNormal;
    private _tempRotationAxis;
    private _tempRotationMatrix;
    private _tempPickingRay;
    private _tempPosition;
    private _viewMatrix;
    private _isViewMatrixDirty;
    private _lookAtVector;
    private _planetRadius;
    private _minAltitude;
    private _maxAltitude?;
    private _maxCameraRadius?;
    private _restingAltitude;
    /** Target of camera when looking along lookAtVector from current position. This does not necessarily represent a point on the globe */
    private get _target();
    /** The point around which the camera will geocentrically rotate. Uses center (pt we are anchored to) if no alternateRotationPt is defined */
    private get _geocentricRotationPt();
    constructor(name: string, scene: Scene, options: CameraOptions, pickPredicate?: MeshPredicate);
    private _resetToDefault;
    /** @internal */
    _getViewMatrix(): Matrix;
    /** @internal */
    _isSynchronizedViewMatrix(): boolean;
    /**
     * Applies rotation correction to the camera by calculating a changeOfBasis matrix from the camera's current position to the new position
     * and transforming the lookAt and up vectors by that matrix before updating the camera position and marking the view matrix as dirty
     * @param newPos The camera's desired position, before correction is applied
     */
    private _applyRotationCorrectionAndSetPos;
    /**
     * When the geocentric normal has any translation change (due to dragging), we must ensure the camera remains orbiting around the world origin
     * We thus need to perform 2 correction steps
     * 1. Translation correction that keeps the camera at the same radius as before the drag
     * 2. Rotation correction that keeps the camera facing the globe (so that as we pan, the globe stays centered on screen)
     */
    private _applyGeocentricTranslation;
    /**
     * This rotation keeps the camera oriented towards the globe as it orbits around it. This is different from cameraCentricRotation which is when the camera rotates around its own axis
     */
    private _applyGeocentricRotation;
    private _clampZoomDistance;
    private _applyZoom;
    private _moveCameraAlongVectorByDistance;
    private get _pickAlongLook();
    _checkInputs(): void;
    attachControl(noPreventDefault?: boolean): void;
    detachControl(): void;
}
export {};
