import { __decorate } from "../tslib.es6.js";
import { serialize, serializeAsVector3, serializeAsMeshReference, serializeAsVector2 } from "../Misc/decorators.js";
import { Observable } from "../Misc/observable.js";
import { Matrix, Vector3, Vector2, TmpVectors, Quaternion } from "../Maths/math.vector.js";
import { Clamp } from "../Maths/math.scalar.functions.js";
import { Node } from "../node.js";
import { Mesh } from "../Meshes/mesh.js";
import { AutoRotationBehavior } from "../Behaviors/Cameras/autoRotationBehavior.js";
import { BouncingBehavior } from "../Behaviors/Cameras/bouncingBehavior.js";
import { FramingBehavior } from "../Behaviors/Cameras/framingBehavior.js";
import { Camera } from "./camera.js";
import { TargetCamera } from "./targetCamera.js";
import { ArcRotateCameraInputsManager } from "../Cameras/arcRotateCameraInputsManager.js";
import { Epsilon } from "../Maths/math.constants.js";
import { Tools } from "../Misc/tools.js";
import { RegisterClass } from "../Misc/typeStore.js";
Node.AddNodeConstructor("ArcRotateCamera", (name, scene) => {
    return () => new ArcRotateCamera(name, 0, 0, 1.0, Vector3.Zero(), scene);
});
/**
 * Computes the alpha angle based on the source position and the target position.
 * @param offset The directional offset between the source position and the target position
 * @returns The alpha angle in radians
 */
export function ComputeAlpha(offset) {
    // Default alpha to π/2 to handle the edge case where x and z are both zero (when looking along up axis)
    let alpha = Math.PI / 2;
    if (!(offset.x === 0 && offset.z === 0)) {
        alpha = Math.acos(offset.x / Math.sqrt(Math.pow(offset.x, 2) + Math.pow(offset.z, 2)));
    }
    if (offset.z < 0) {
        alpha = 2 * Math.PI - alpha;
    }
    return alpha;
}
/**
 * Computes the beta angle based on the source position and the target position.
 * @param verticalOffset The y value of the directional offset between the source position and the target position
 * @param radius The distance between the source position and the target position
 * @returns The beta angle in radians
 */
export function ComputeBeta(verticalOffset, radius) {
    return Math.acos(verticalOffset / radius);
}
// Returns the value if not NaN, otherwise returns the fallback value.
function CheckNaN(value, fallback) {
    return isNaN(value) ? fallback : value;
}
/**
 * This represents an orbital type of camera.
 *
 * This camera always points towards a given target position and can be rotated around that target with the target as the centre of rotation. It can be controlled with cursors and mouse, or with touch events.
 * Think of this camera as one orbiting its target position, or more imaginatively as a spy satellite orbiting the earth. Its position relative to the target (earth) can be set by three parameters, alpha (radians) the longitudinal rotation, beta (radians) the latitudinal rotation and radius the distance from the target position.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#arc-rotate-camera
 */
export class ArcRotateCamera extends TargetCamera {
    /**
     * Defines the target point of the camera.
     * The camera looks towards it from the radius distance.
     */
    get target() {
        return this._target;
    }
    set target(value) {
        this.setTarget(value);
    }
    /**
     * Defines the target transform node of the camera.
     * The camera looks towards it from the radius distance.
     * Please note that setting a target host will disable panning.
     */
    get targetHost() {
        return this._targetHost;
    }
    set targetHost(value) {
        if (value) {
            this.setTarget(value);
        }
    }
    /**
     * Return the current target position of the camera. This value is expressed in local space.
     * @returns the target position
     */
    getTarget() {
        return this.target;
    }
    /**
     * Define the current local position of the camera in the scene
     */
    get position() {
        return this._position;
    }
    set position(newPosition) {
        this.setPosition(newPosition);
    }
    /**
     * The vector the camera should consider as up. (default is Vector3(0, 1, 0) as returned by Vector3.Up())
     * Setting this will copy the given vector to the camera's upVector, and set rotation matrices to and from Y up.
     * DO NOT set the up vector using copyFrom or copyFromFloats, as this bypasses setting the above matrices.
     */
    set upVector(vec) {
        if (!this._upToYMatrix) {
            this._yToUpMatrix = new Matrix();
            this._upToYMatrix = new Matrix();
            this._upVector = Vector3.Zero();
        }
        vec.normalize();
        this._upVector.copyFrom(vec);
        this.setMatUp();
    }
    get upVector() {
        return this._upVector;
    }
    /**
     * Sets the Y-up to camera up-vector rotation matrix, and the up-vector to Y-up rotation matrix.
     */
    setMatUp() {
        // from y-up to custom-up (used in _getViewMatrix)
        Matrix.RotationAlignToRef(Vector3.UpReadOnly, this._upVector, this._yToUpMatrix);
        // from custom-up to y-up (used in rebuildAnglesAndRadius)
        Matrix.RotationAlignToRef(this._upVector, Vector3.UpReadOnly, this._upToYMatrix);
    }
    //-- begin properties for backward compatibility for inputs
    /**
     * Gets or Set the pointer angular sensibility  along the X axis or how fast is the camera rotating.
     */
    get angularSensibilityX() {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            return pointers.angularSensibilityX;
        }
        return 0;
    }
    set angularSensibilityX(value) {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            pointers.angularSensibilityX = value;
        }
    }
    /**
     * Gets or Set the pointer angular sensibility along the Y axis or how fast is the camera rotating.
     */
    get angularSensibilityY() {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            return pointers.angularSensibilityY;
        }
        return 0;
    }
    set angularSensibilityY(value) {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            pointers.angularSensibilityY = value;
        }
    }
    /**
     * Gets or Set the pointer pinch precision or how fast is the camera zooming.
     */
    get pinchPrecision() {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            return pointers.pinchPrecision;
        }
        return 0;
    }
    set pinchPrecision(value) {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            pointers.pinchPrecision = value;
        }
    }
    /**
     * Gets or Set the pointer pinch delta percentage or how fast is the camera zooming.
     * It will be used instead of pinchPrecision if different from 0.
     * It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
     */
    get pinchDeltaPercentage() {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            return pointers.pinchDeltaPercentage;
        }
        return 0;
    }
    set pinchDeltaPercentage(value) {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            pointers.pinchDeltaPercentage = value;
        }
    }
    /**
     * Gets or Set the pointer use natural pinch zoom to override the pinch precision
     * and pinch delta percentage.
     * When useNaturalPinchZoom is true, multi touch zoom will zoom in such
     * that any object in the plane at the camera's target point will scale
     * perfectly with finger motion.
     */
    get useNaturalPinchZoom() {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            return pointers.useNaturalPinchZoom;
        }
        return false;
    }
    set useNaturalPinchZoom(value) {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            pointers.useNaturalPinchZoom = value;
        }
    }
    /**
     * Gets or Set the pointer panning sensibility or how fast is the camera moving.
     */
    get panningSensibility() {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            return pointers.panningSensibility;
        }
        return 0;
    }
    set panningSensibility(value) {
        const pointers = this.inputs.attached["pointers"];
        if (pointers) {
            pointers.panningSensibility = value;
        }
    }
    /**
     * Gets or Set the list of keyboard keys used to control beta angle in a positive direction.
     */
    get keysUp() {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            return keyboard.keysUp;
        }
        return [];
    }
    set keysUp(value) {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            keyboard.keysUp = value;
        }
    }
    /**
     * Gets or Set the list of keyboard keys used to control beta angle in a negative direction.
     */
    get keysDown() {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            return keyboard.keysDown;
        }
        return [];
    }
    set keysDown(value) {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            keyboard.keysDown = value;
        }
    }
    /**
     * Gets or Set the list of keyboard keys used to control alpha angle in a negative direction.
     */
    get keysLeft() {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            return keyboard.keysLeft;
        }
        return [];
    }
    set keysLeft(value) {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            keyboard.keysLeft = value;
        }
    }
    /**
     * Gets or Set the list of keyboard keys used to control alpha angle in a positive direction.
     */
    get keysRight() {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            return keyboard.keysRight;
        }
        return [];
    }
    set keysRight(value) {
        const keyboard = this.inputs.attached["keyboard"];
        if (keyboard) {
            keyboard.keysRight = value;
        }
    }
    /**
     * Gets or Set the mouse wheel precision or how fast is the camera zooming.
     */
    get wheelPrecision() {
        const mousewheel = this.inputs.attached["mousewheel"];
        if (mousewheel) {
            return mousewheel.wheelPrecision;
        }
        return 0;
    }
    set wheelPrecision(value) {
        const mousewheel = this.inputs.attached["mousewheel"];
        if (mousewheel) {
            mousewheel.wheelPrecision = value;
        }
    }
    /**
     * Gets or Set the boolean value that controls whether or not the mouse wheel
     * zooms to the location of the mouse pointer or not.  The default is false.
     */
    get zoomToMouseLocation() {
        const mousewheel = this.inputs.attached["mousewheel"];
        if (mousewheel) {
            return mousewheel.zoomToMouseLocation;
        }
        return false;
    }
    set zoomToMouseLocation(value) {
        const mousewheel = this.inputs.attached["mousewheel"];
        if (mousewheel) {
            mousewheel.zoomToMouseLocation = value;
        }
    }
    /**
     * Gets or Set the mouse wheel delta percentage or how fast is the camera zooming.
     * It will be used instead of wheelPrecision if different from 0.
     * It defines the percentage of current camera.radius to use as delta when wheel zoom is used.
     */
    get wheelDeltaPercentage() {
        const mousewheel = this.inputs.attached["mousewheel"];
        if (mousewheel) {
            return mousewheel.wheelDeltaPercentage;
        }
        return 0;
    }
    set wheelDeltaPercentage(value) {
        const mousewheel = this.inputs.attached["mousewheel"];
        if (mousewheel) {
            mousewheel.wheelDeltaPercentage = value;
        }
    }
    /**
     * If true, indicates the camera is currently interpolating to a new pose.
     */
    get isInterpolating() {
        return this._isInterpolating;
    }
    /**
     * Gets the bouncing behavior of the camera if it has been enabled.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
     */
    get bouncingBehavior() {
        return this._bouncingBehavior;
    }
    /**
     * Defines if the bouncing behavior of the camera is enabled on the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
     */
    get useBouncingBehavior() {
        return this._bouncingBehavior != null;
    }
    set useBouncingBehavior(value) {
        if (value === this.useBouncingBehavior) {
            return;
        }
        if (value) {
            this._bouncingBehavior = new BouncingBehavior();
            this.addBehavior(this._bouncingBehavior);
        }
        else if (this._bouncingBehavior) {
            this.removeBehavior(this._bouncingBehavior);
            this._bouncingBehavior = null;
        }
    }
    /**
     * Gets the framing behavior of the camera if it has been enabled.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
     */
    get framingBehavior() {
        return this._framingBehavior;
    }
    /**
     * Defines if the framing behavior of the camera is enabled on the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
     */
    get useFramingBehavior() {
        return this._framingBehavior != null;
    }
    set useFramingBehavior(value) {
        if (value === this.useFramingBehavior) {
            return;
        }
        if (value) {
            this._framingBehavior = new FramingBehavior();
            this.addBehavior(this._framingBehavior);
        }
        else if (this._framingBehavior) {
            this.removeBehavior(this._framingBehavior);
            this._framingBehavior = null;
        }
    }
    /**
     * Gets the auto rotation behavior of the camera if it has been enabled.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
     */
    get autoRotationBehavior() {
        return this._autoRotationBehavior;
    }
    /**
     * Defines if the auto rotation behavior of the camera is enabled on the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
     */
    get useAutoRotationBehavior() {
        return this._autoRotationBehavior != null;
    }
    set useAutoRotationBehavior(value) {
        if (value === this.useAutoRotationBehavior) {
            return;
        }
        if (value) {
            this._autoRotationBehavior = new AutoRotationBehavior();
            this.addBehavior(this._autoRotationBehavior);
        }
        else if (this._autoRotationBehavior) {
            this.removeBehavior(this._autoRotationBehavior);
            this._autoRotationBehavior = null;
        }
    }
    /**
     * Instantiates a new ArcRotateCamera in a given scene
     * @param name Defines the name of the camera
     * @param alpha Defines the camera rotation along the longitudinal axis
     * @param beta Defines the camera rotation along the latitudinal axis
     * @param radius Defines the camera distance from its target
     * @param target Defines the camera target
     * @param scene Defines the scene the camera belongs to
     * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active if not other active cameras have been defined
     */
    constructor(name, alpha, beta, radius, target, scene, setActiveOnSceneIfNoneActive = true) {
        super(name, Vector3.Zero(), scene, setActiveOnSceneIfNoneActive);
        /**
         * Current inertia value on the longitudinal axis.
         * The bigger this number the longer it will take for the camera to stop.
         */
        this.inertialAlphaOffset = 0;
        /**
         * Current inertia value on the latitudinal axis.
         * The bigger this number the longer it will take for the camera to stop.
         */
        this.inertialBetaOffset = 0;
        /**
         * Current inertia value on the radius axis.
         * The bigger this number the longer it will take for the camera to stop.
         */
        this.inertialRadiusOffset = 0;
        /**
         * Minimum allowed angle on the longitudinal axis.
         * This can help limiting how the Camera is able to move in the scene.
         */
        this.lowerAlphaLimit = null;
        /**
         * Maximum allowed angle on the longitudinal axis.
         * This can help limiting how the Camera is able to move in the scene.
         */
        this.upperAlphaLimit = null;
        /**
         * Minimum allowed angle on the latitudinal axis.
         * This can help limiting how the Camera is able to move in the scene.
         */
        this.lowerBetaLimit = 0.01;
        /**
         * Maximum allowed angle on the latitudinal axis.
         * This can help limiting how the Camera is able to move in the scene.
         */
        this.upperBetaLimit = Math.PI - 0.01;
        /**
         * Minimum allowed distance of the camera to the target (The camera can not get closer).
         * This can help limiting how the Camera is able to move in the scene.
         */
        this.lowerRadiusLimit = null;
        /**
         * Maximum allowed distance of the camera to the target (The camera can not get further).
         * This can help limiting how the Camera is able to move in the scene.
         */
        this.upperRadiusLimit = null;
        /**
         * Minimum allowed vertical target position of the camera.
         * Use this setting in combination with `upperRadiusLimit` to set a global limit for the Cameras vertical position.
         */
        this.lowerTargetYLimit = -Infinity;
        /**
         * Defines the current inertia value used during panning of the camera along the X axis.
         */
        this.inertialPanningX = 0;
        /**
         * Defines the current inertia value used during panning of the camera along the Y axis.
         */
        this.inertialPanningY = 0;
        /**
         * Defines the distance used to consider the camera in pan mode vs pinch/zoom.
         * Basically if your fingers moves away from more than this distance you will be considered
         * in pinch mode.
         */
        this.pinchToPanMaxDistance = 20;
        /**
         * Defines the maximum distance the camera can pan.
         * This could help keeping the camera always in your scene.
         */
        this.panningDistanceLimit = null;
        /**
         * Defines the target of the camera before panning.
         */
        this.panningOriginTarget = Vector3.Zero();
        /**
         * Defines the value of the inertia used during panning.
         * 0 would mean stop inertia and one would mean no deceleration at all.
         */
        this.panningInertia = 0.9;
        //-- end properties for backward compatibility for inputs
        /**
         * Defines how much the radius should be scaled while zooming on a particular mesh (through the zoomOn function)
         */
        this.zoomOnFactor = 1;
        /**
         * Defines a screen offset for the camera position.
         */
        this.targetScreenOffset = Vector2.Zero();
        /**
         * Allows the camera to be completely reversed.
         * If false the camera can not arrive upside down.
         */
        this.allowUpsideDown = true;
        /**
         * Define if double tap/click is used to restore the previously saved state of the camera.
         */
        this.useInputToRestoreState = true;
        /**
         * Factor for restoring information interpolation. default is 0 = off. Any value \< 0 or \> 1 will disable interpolation.
         */
        this.restoreStateInterpolationFactor = 0;
        this._currentInterpolationFactor = 0;
        /** @internal */
        this._viewMatrix = new Matrix();
        /**
         * Defines the allowed panning axis.
         */
        this.panningAxis = new Vector3(1, 1, 0);
        this._transformedDirection = new Vector3();
        /**
         * Defines if camera will eliminate transform on y axis.
         */
        this.mapPanning = false;
        // This is redundant with all _goal* properties being NaN, but we track it anyway because we check for active interpolation in the hot path.
        this._isInterpolating = false;
        /**
         * Observable triggered when the transform node target has been changed on the camera.
         */
        this.onMeshTargetChangedObservable = new Observable();
        /**
         * Defines whether the camera should check collision with the objects oh the scene.
         * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#how-can-i-do-this-
         */
        this.checkCollisions = false;
        /**
         * Defines the collision radius of the camera.
         * This simulates a sphere around the camera.
         * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#arcrotatecamera
         */
        this.collisionRadius = new Vector3(0.5, 0.5, 0.5);
        this._previousPosition = Vector3.Zero();
        this._collisionVelocity = Vector3.Zero();
        this._newPosition = Vector3.Zero();
        this._computationVector = Vector3.Zero();
        this._goalAlpha = NaN;
        this._goalBeta = NaN;
        this._goalRadius = NaN;
        this._goalTarget = new Vector3(NaN, NaN, NaN);
        this._goalTargetScreenOffset = new Vector2(NaN, NaN);
        this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
            if (!collidedMesh) {
                this._previousPosition.copyFrom(this._position);
            }
            else {
                this.setPosition(newPosition);
                if (this.onCollide) {
                    this.onCollide(collidedMesh);
                }
            }
            // Recompute because of constraints
            const cosa = Math.cos(this.alpha);
            const sina = Math.sin(this.alpha);
            const cosb = Math.cos(this.beta);
            let sinb = Math.sin(this.beta);
            if (sinb === 0) {
                sinb = 0.0001;
            }
            const target = this._getTargetPosition();
            this._computationVector.copyFromFloats(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb);
            target.addToRef(this._computationVector, this._newPosition);
            this._position.copyFrom(this._newPosition);
            let up = this.upVector;
            if (this.allowUpsideDown && this.beta < 0) {
                up = up.clone();
                up = up.negate();
            }
            this._computeViewMatrix(this._position, target, up);
            this._viewMatrix.addAtIndex(12, this.targetScreenOffset.x);
            this._viewMatrix.addAtIndex(13, this.targetScreenOffset.y);
            this._collisionTriggered = false;
        };
        this._target = Vector3.Zero();
        if (target) {
            this.setTarget(target);
        }
        this.alpha = alpha;
        this.beta = beta;
        this.radius = radius;
        this.getViewMatrix();
        this.inputs = new ArcRotateCameraInputsManager(this);
        this.inputs.addKeyboard().addMouseWheel().addPointers();
    }
    // Cache
    /** @internal */
    _initCache() {
        super._initCache();
        this._cache._target = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.alpha = undefined;
        this._cache.beta = undefined;
        this._cache.radius = undefined;
        this._cache.targetScreenOffset = Vector2.Zero();
    }
    /**
     * @internal
     */
    _updateCache(ignoreParentClass) {
        if (!ignoreParentClass) {
            super._updateCache();
        }
        this._cache._target.copyFrom(this._getTargetPosition());
        this._cache.alpha = this.alpha;
        this._cache.beta = this.beta;
        this._cache.radius = this.radius;
        this._cache.targetScreenOffset.copyFrom(this.targetScreenOffset);
    }
    _getTargetPosition() {
        if (this._targetHost && this._targetHost.getAbsolutePosition) {
            const pos = this._targetHost.getAbsolutePosition();
            if (this._targetBoundingCenter) {
                pos.addToRef(this._targetBoundingCenter, this._target);
            }
            else {
                this._target.copyFrom(pos);
            }
        }
        const lockedTargetPosition = this._getLockedTargetPosition();
        if (lockedTargetPosition) {
            return lockedTargetPosition;
        }
        return this._target;
    }
    /**
     * Stores the current state of the camera (alpha, beta, radius and target)
     * @returns the camera itself
     */
    storeState() {
        this._storedAlpha = this.alpha;
        this._storedBeta = this.beta;
        this._storedRadius = this.radius;
        this._storedTarget = this._getTargetPosition().clone();
        this._storedTargetScreenOffset = this.targetScreenOffset.clone();
        return super.storeState();
    }
    /**
     * @internal
     * Restored camera state. You must call storeState() first
     */
    _restoreStateValues() {
        if (this.hasStateStored() && this.restoreStateInterpolationFactor > Epsilon && this.restoreStateInterpolationFactor < 1) {
            this.interpolateTo(this._storedAlpha, this._storedBeta, this._storedRadius, this._storedTarget, this._storedTargetScreenOffset, this.restoreStateInterpolationFactor);
            return true;
        }
        if (!super._restoreStateValues()) {
            return false;
        }
        this.setTarget(this._storedTarget.clone());
        this.alpha = this._storedAlpha;
        this.beta = this._storedBeta;
        this.radius = this._storedRadius;
        this.targetScreenOffset = this._storedTargetScreenOffset.clone();
        this.inertialAlphaOffset = 0;
        this.inertialBetaOffset = 0;
        this.inertialRadiusOffset = 0;
        this.inertialPanningX = 0;
        this.inertialPanningY = 0;
        return true;
    }
    /**
     * Stops any in-progress interpolation.
     */
    stopInterpolation() {
        this._goalAlpha = NaN;
        this._goalBeta = NaN;
        this._goalRadius = NaN;
        this._goalTarget.set(NaN, NaN, NaN);
        this._goalTargetScreenOffset.set(NaN, NaN);
    }
    /**
     * Interpolates the camera to a goal state.
     * @param alpha Defines the goal alpha.
     * @param beta Defines the goal beta.
     * @param radius Defines the goal radius.
     * @param target Defines the goal target.
     * @param targetScreenOffset Defines the goal target screen offset.
     * @param interpolationFactor A value  between 0 and 1 that determines the speed of the interpolation.
     * @remarks Passing undefined for any of the parameters will use the current value (effectively stopping any in-progress interpolation for that parameter).
     *          Passing NaN will not start or stop any interpolation for that parameter (effectively allowing multiple interpolations of different parameters to overlap).
     */
    interpolateTo(alpha = this.alpha, beta = this.beta, radius = this.radius, target = this.target, targetScreenOffset = this.targetScreenOffset, interpolationFactor) {
        this.inertialAlphaOffset = 0;
        this.inertialBetaOffset = 0;
        this.inertialRadiusOffset = 0;
        this.inertialPanningX = 0;
        this.inertialPanningY = 0;
        if (interpolationFactor != null) {
            this._currentInterpolationFactor = interpolationFactor;
        }
        else if (this.restoreStateInterpolationFactor !== 0) {
            this._currentInterpolationFactor = this.restoreStateInterpolationFactor;
        }
        else {
            this._currentInterpolationFactor = 0.1;
        }
        // If NaN is passed in for a goal value, keep the current goal value.
        this._goalAlpha = CheckNaN(alpha, this._goalAlpha);
        this._goalBeta = CheckNaN(beta, this._goalBeta);
        this._goalRadius = CheckNaN(radius, this._goalRadius);
        this._goalTarget.set(CheckNaN(target.x, this._goalTarget.x), CheckNaN(target.y, this._goalTarget.y), CheckNaN(target.z, this._goalTarget.z));
        this._goalTargetScreenOffset.set(CheckNaN(targetScreenOffset.x, this._goalTargetScreenOffset.x), CheckNaN(targetScreenOffset.y, this._goalTargetScreenOffset.y));
        this._goalAlpha = Clamp(this._goalAlpha, this.lowerAlphaLimit ?? -Infinity, this.upperAlphaLimit ?? Infinity);
        this._goalBeta = Clamp(this._goalBeta, this.lowerBetaLimit ?? -Infinity, this.upperBetaLimit ?? Infinity);
        this._goalRadius = Clamp(this._goalRadius, this.lowerRadiusLimit ?? -Infinity, this.upperRadiusLimit ?? Infinity);
        this._goalTarget.y = Clamp(this._goalTarget.y, this.lowerTargetYLimit ?? -Infinity, Infinity);
        this._isInterpolating = true;
    }
    // Synchronized
    /** @internal */
    _isSynchronizedViewMatrix() {
        if (!super._isSynchronizedViewMatrix()) {
            return false;
        }
        return (this._cache._target.equals(this._getTargetPosition()) &&
            this._cache.alpha === this.alpha &&
            this._cache.beta === this.beta &&
            this._cache.radius === this.radius &&
            this._cache.targetScreenOffset.equals(this.targetScreenOffset));
    }
    /**
     * Attached controls to the current camera.
     * @param ignored defines an ignored parameter kept for backward compatibility.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     * @param useCtrlForPanning  Defines whether ctrl is used for panning within the controls
     * @param panningMouseButton Defines whether panning is allowed through mouse click button
     */
    attachControl(ignored, noPreventDefault, useCtrlForPanning = true, panningMouseButton = 2) {
        const args = arguments;
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(args);
        this._useCtrlForPanning = useCtrlForPanning;
        this._panningMouseButton = panningMouseButton;
        // backwards compatibility
        if (typeof args[0] === "boolean") {
            if (args.length > 1) {
                this._useCtrlForPanning = args[1];
            }
            if (args.length > 2) {
                this._panningMouseButton = args[2];
            }
        }
        this.inputs.attachElement(noPreventDefault);
        this._reset = () => {
            this.inertialAlphaOffset = 0;
            this.inertialBetaOffset = 0;
            this.inertialRadiusOffset = 0;
            this.inertialPanningX = 0;
            this.inertialPanningY = 0;
        };
    }
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl() {
        this.inputs.detachElement();
        if (this._reset) {
            this._reset();
        }
    }
    /** @internal */
    _checkInputs() {
        //if (async) collision inspection was triggered, don't update the camera's position - until the collision callback was called.
        if (this._collisionTriggered) {
            return;
        }
        this.inputs.checkInputs();
        let hasUserInteractions = false;
        const inertialPanningLimit = this.speed * this._panningEpsilon;
        const inertialRotationLimit = this.speed * this._rotationEpsilon;
        // Inertia
        if (this.inertialAlphaOffset !== 0 || this.inertialBetaOffset !== 0 || this.inertialRadiusOffset !== 0) {
            hasUserInteractions = true;
            const directionModifier = this.invertRotation ? -1 : 1;
            const handednessMultiplier = this._calculateHandednessMultiplier();
            let inertialAlphaOffset = this.inertialAlphaOffset * handednessMultiplier;
            if (this.beta < 0) {
                inertialAlphaOffset *= -1;
            }
            this.alpha += inertialAlphaOffset * directionModifier;
            this.beta += this.inertialBetaOffset * directionModifier;
            this.radius -= this.inertialRadiusOffset;
            this.inertialAlphaOffset *= this.inertia;
            this.inertialBetaOffset *= this.inertia;
            this.inertialRadiusOffset *= this.inertia;
            if (Math.abs(this.inertialAlphaOffset) < inertialRotationLimit) {
                this.inertialAlphaOffset = 0;
            }
            if (Math.abs(this.inertialBetaOffset) < inertialRotationLimit) {
                this.inertialBetaOffset = 0;
            }
            if (Math.abs(this.inertialRadiusOffset) < inertialRotationLimit) {
                this.inertialRadiusOffset = 0;
            }
        }
        // Panning inertia
        if (this.inertialPanningX !== 0 || this.inertialPanningY !== 0) {
            hasUserInteractions = true;
            const localDirection = new Vector3(this.inertialPanningX, this.inertialPanningY, this.inertialPanningY);
            this._viewMatrix.invertToRef(this._cameraTransformMatrix);
            localDirection.multiplyInPlace(this.panningAxis);
            Vector3.TransformNormalToRef(localDirection, this._cameraTransformMatrix, this._transformedDirection);
            // If mapPanning is enabled, we need to take the upVector into account and
            // make sure we're not panning in the y direction
            if (this.mapPanning) {
                const up = this.upVector;
                const right = Vector3.CrossToRef(this._transformedDirection, up, this._transformedDirection);
                Vector3.CrossToRef(up, right, this._transformedDirection);
            }
            else if (!this.panningAxis.y) {
                this._transformedDirection.y = 0;
            }
            if (!this._targetHost) {
                if (this.panningDistanceLimit) {
                    this._transformedDirection.addInPlace(this._target);
                    const distanceSquared = Vector3.DistanceSquared(this._transformedDirection, this.panningOriginTarget);
                    if (distanceSquared <= this.panningDistanceLimit * this.panningDistanceLimit) {
                        this._target.copyFrom(this._transformedDirection);
                    }
                }
                else {
                    if (this.parent) {
                        const m = TmpVectors.Matrix[0];
                        this.parent.getWorldMatrix().getRotationMatrixToRef(m);
                        m.transposeToRef(m);
                        Vector3.TransformCoordinatesToRef(this._transformedDirection, m, this._transformedDirection);
                    }
                    this._target.addInPlace(this._transformedDirection);
                }
            }
            this.inertialPanningX *= this.panningInertia;
            this.inertialPanningY *= this.panningInertia;
            if (Math.abs(this.inertialPanningX) < inertialPanningLimit) {
                this.inertialPanningX = 0;
            }
            if (Math.abs(this.inertialPanningY) < inertialPanningLimit) {
                this.inertialPanningY = 0;
            }
        }
        if (hasUserInteractions) {
            this.stopInterpolation();
        }
        else if (this._isInterpolating) {
            let isInterpolating = false;
            const dt = this._scene.getEngine().getDeltaTime() / 1000;
            const t = 1 - Math.pow(2, -dt / this._currentInterpolationFactor);
            // NOTE: If the goal is NaN, it means we are not interpolating to a new value, so we can use the current value. Hence the calls to checkNaN.
            // Get the goal radius immediately as we'll need it for determining interpolation termination for the target.
            const goalRadius = CheckNaN(this._goalRadius, this.radius);
            // Interpolate the target if we haven't reached the goal yet.
            if (!isNaN(this._goalTarget.x) || !isNaN(this._goalTarget.y) || !isNaN(this._goalTarget.z)) {
                const goalTarget = TmpVectors.Vector3[0].set(CheckNaN(this._goalTarget.x, this._target.x), CheckNaN(this._goalTarget.y, this._target.y), CheckNaN(this._goalTarget.z, this._target.z));
                Vector3.LerpToRef(this.target, goalTarget, t, this._target);
                // Terminate the target interpolation if we the target is close relative to the radius.
                // This is when visually (regardless of scale) the target appears close to its final goal position.
                if ((Vector3.Distance(this.target, goalTarget) * 10) / goalRadius < Epsilon) {
                    this._goalTarget.set(NaN, NaN, NaN);
                    this.target.copyFrom(goalTarget);
                    // Call setTarget to trigger side effects like onMeshTargetChangedObservable.
                    // NOTE: We pass in true for allowSamePosition because we already checked that the goal target is different from the current target,
                    // but since we are updating the existing target Vector3 instance, it will otherwise look like the value has not changed.
                    this.setTarget(this.target, false, true, true);
                }
                else {
                    isInterpolating = true;
                }
            }
            // Interpolate the rotation if we haven't reached the goal yet.
            if (!isNaN(this._goalAlpha) || !isNaN(this._goalBeta)) {
                // Using quaternion for smoother interpolation (and no Euler angles modulo)
                const goalRotation = Quaternion.RotationAlphaBetaGammaToRef(CheckNaN(this._goalAlpha, this.alpha), CheckNaN(this._goalBeta, this.beta), 0, TmpVectors.Quaternion[0]);
                const currentRotation = Quaternion.RotationAlphaBetaGammaToRef(this.alpha, this.beta, 0, TmpVectors.Quaternion[1]);
                const newRotation = Quaternion.SlerpToRef(currentRotation, goalRotation, t, TmpVectors.Quaternion[2]);
                newRotation.normalize();
                const newAlphaBetaGamma = newRotation.toAlphaBetaGammaToRef(TmpVectors.Vector3[0]);
                this.alpha = newAlphaBetaGamma.x;
                this.beta = newAlphaBetaGamma.y;
                // Terminate the rotation interpolation when the rotation appears visually close to the final goal rotation.
                if (newRotation.isApprox(goalRotation, Epsilon / 5)) {
                    this._goalAlpha = NaN;
                    this._goalBeta = NaN;
                    const goalAlphaBetaGamma = goalRotation.toAlphaBetaGammaToRef(TmpVectors.Vector3[0]);
                    this.alpha = goalAlphaBetaGamma.x;
                    this.beta = goalAlphaBetaGamma.y;
                }
                else {
                    isInterpolating = true;
                }
            }
            // Interpolate the radius if we haven't reached the goal yet.
            if (!isNaN(this._goalRadius)) {
                this.radius += (goalRadius - this.radius) * t;
                // Terminate the radius interpolation when we are 99.9% of the way to the goal radius, at which point it is visually indistinguishable from the goal.
                if (Math.abs(goalRadius / this.radius - 1) < Epsilon) {
                    this._goalRadius = NaN;
                    this.radius = goalRadius;
                }
                else {
                    isInterpolating = true;
                }
            }
            // Interpolate the target screen offset if we haven't reached the goal yet.
            if (!isNaN(this._goalTargetScreenOffset.x) || !isNaN(this._goalTargetScreenOffset.y)) {
                const goalTargetScreenOffset = TmpVectors.Vector2[0].set(CheckNaN(this._goalTargetScreenOffset.x, this.targetScreenOffset.x), CheckNaN(this._goalTargetScreenOffset.y, this.targetScreenOffset.y));
                Vector2.LerpToRef(this.targetScreenOffset, goalTargetScreenOffset, t, this.targetScreenOffset);
                // Terminate the target screen offset interpolation when the target screen offset appears visually close to the final goal target screen offset.
                if (Vector2.Distance(this.targetScreenOffset, goalTargetScreenOffset) < Epsilon) {
                    this._goalTargetScreenOffset.set(NaN, NaN);
                    this.targetScreenOffset.copyFrom(goalTargetScreenOffset);
                }
                else {
                    isInterpolating = true;
                }
            }
            this._isInterpolating = isInterpolating;
        }
        // Limits
        this._checkLimits();
        super._checkInputs();
    }
    _checkLimits() {
        if (this.lowerBetaLimit === null || this.lowerBetaLimit === undefined) {
            if (this.allowUpsideDown && this.beta > Math.PI) {
                this.beta = this.beta - 2 * Math.PI;
            }
        }
        else {
            if (this.beta < this.lowerBetaLimit) {
                this.beta = this.lowerBetaLimit;
            }
        }
        if (this.upperBetaLimit === null || this.upperBetaLimit === undefined) {
            if (this.allowUpsideDown && this.beta < -Math.PI) {
                this.beta = this.beta + 2 * Math.PI;
            }
        }
        else {
            if (this.beta > this.upperBetaLimit) {
                this.beta = this.upperBetaLimit;
            }
        }
        if (this.lowerAlphaLimit !== null && this.alpha < this.lowerAlphaLimit) {
            this.alpha = this.lowerAlphaLimit;
        }
        if (this.upperAlphaLimit !== null && this.alpha > this.upperAlphaLimit) {
            this.alpha = this.upperAlphaLimit;
        }
        if (this.lowerRadiusLimit !== null && this.radius < this.lowerRadiusLimit) {
            this.radius = this.lowerRadiusLimit;
            this.inertialRadiusOffset = 0;
        }
        if (this.upperRadiusLimit !== null && this.radius > this.upperRadiusLimit) {
            this.radius = this.upperRadiusLimit;
            this.inertialRadiusOffset = 0;
        }
        this.target.y = Math.max(this.target.y, this.lowerTargetYLimit);
    }
    /**
     * Rebuilds angles (alpha, beta) and radius from the give position and target
     */
    rebuildAnglesAndRadius() {
        this._position.subtractToRef(this._getTargetPosition(), this._computationVector);
        // need to rotate to Y up equivalent if up vector not Axis.Y
        if (this._upVector.x !== 0 || this._upVector.y !== 1.0 || this._upVector.z !== 0) {
            Vector3.TransformCoordinatesToRef(this._computationVector, this._upToYMatrix, this._computationVector);
        }
        this.radius = this._computationVector.length();
        if (this.radius === 0) {
            this.radius = 0.0001; // Just to avoid division by zero
        }
        // Alpha and Beta
        const previousAlpha = this.alpha;
        this.alpha = ComputeAlpha(this._computationVector);
        this.beta = ComputeBeta(this._computationVector.y, this.radius);
        // Calculate the number of revolutions between the new and old alpha values.
        const alphaCorrectionTurns = Math.round((previousAlpha - this.alpha) / (2.0 * Math.PI));
        // Adjust alpha so that its numerical representation is the closest one to the old value.
        this.alpha += alphaCorrectionTurns * 2.0 * Math.PI;
        this._checkLimits();
    }
    /**
     * Use a position to define the current camera related information like alpha, beta and radius
     * @param position Defines the position to set the camera at
     */
    setPosition(position) {
        if (this._position.equals(position)) {
            return;
        }
        this._position.copyFrom(position);
        this.rebuildAnglesAndRadius();
    }
    /**
     * Defines the target the camera should look at.
     * This will automatically adapt alpha beta and radius to fit within the new target.
     * Please note that setting a target as a mesh will disable panning.
     * @param target Defines the new target as a Vector or a transform node
     * @param toBoundingCenter In case of a mesh target, defines whether to target the mesh position or its bounding information center
     * @param allowSamePosition If false, prevents reapplying the new computed position if it is identical to the current one (optim)
     * @param cloneAlphaBetaRadius If true, replicate the current setup (alpha, beta, radius) on the new target
     */
    setTarget(target, toBoundingCenter = false, allowSamePosition = false, cloneAlphaBetaRadius = false) {
        cloneAlphaBetaRadius = this.overrideCloneAlphaBetaRadius ?? cloneAlphaBetaRadius;
        if (target.computeWorldMatrix) {
            if (toBoundingCenter && target.getBoundingInfo) {
                this._targetBoundingCenter = target.getBoundingInfo().boundingBox.centerWorld.clone();
            }
            else {
                this._targetBoundingCenter = null;
            }
            target.computeWorldMatrix();
            this._targetHost = target;
            this._target = this._getTargetPosition();
            this.onMeshTargetChangedObservable.notifyObservers(this._targetHost);
        }
        else {
            const newTarget = target;
            const currentTarget = this._getTargetPosition();
            if (currentTarget && !allowSamePosition && currentTarget.equals(newTarget)) {
                return;
            }
            this._targetHost = null;
            this._target = newTarget;
            this._targetBoundingCenter = null;
            this.onMeshTargetChangedObservable.notifyObservers(null);
        }
        if (!cloneAlphaBetaRadius) {
            this.rebuildAnglesAndRadius();
        }
    }
    /** @internal */
    _getViewMatrix() {
        // Compute
        const cosa = Math.cos(this.alpha);
        const sina = Math.sin(this.alpha);
        const cosb = Math.cos(this.beta);
        let sinb = Math.sin(this.beta);
        if (sinb === 0) {
            sinb = 0.0001;
        }
        if (this.radius === 0) {
            this.radius = 0.0001; // Just to avoid division by zero
        }
        const target = this._getTargetPosition();
        this._computationVector.copyFromFloats(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb);
        // Rotate according to up vector
        if (this._upVector.x !== 0 || this._upVector.y !== 1.0 || this._upVector.z !== 0) {
            Vector3.TransformCoordinatesToRef(this._computationVector, this._yToUpMatrix, this._computationVector);
        }
        target.addToRef(this._computationVector, this._newPosition);
        if (this.getScene().collisionsEnabled && this.checkCollisions) {
            const coordinator = this.getScene().collisionCoordinator;
            if (!this._collider) {
                this._collider = coordinator.createCollider();
            }
            this._collider._radius = this.collisionRadius;
            this._newPosition.subtractToRef(this._position, this._collisionVelocity);
            this._collisionTriggered = true;
            coordinator.getNewPosition(this._position, this._collisionVelocity, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
        }
        else {
            this._position.copyFrom(this._newPosition);
            let up = this.upVector;
            if (this.allowUpsideDown && sinb < 0) {
                up = up.negate();
            }
            this._computeViewMatrix(this._position, target, up);
            this._viewMatrix.addAtIndex(12, this.targetScreenOffset.x);
            this._viewMatrix.addAtIndex(13, this.targetScreenOffset.y);
        }
        this._currentTarget.copyFrom(target);
        return this._viewMatrix;
    }
    /**
     * Zooms on a mesh to be at the min distance where we could see it fully in the current viewport.
     * @param meshes Defines the mesh to zoom on
     * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
     */
    zoomOn(meshes, doNotUpdateMaxZ = false) {
        meshes = meshes || this.getScene().meshes;
        const minMaxVector = Mesh.MinMax(meshes);
        let distance = this._calculateLowerRadiusFromModelBoundingSphere(minMaxVector.min, minMaxVector.max);
        // If there are defined limits, we need to take them into account
        distance = Math.max(Math.min(distance, this.upperRadiusLimit || Number.MAX_VALUE), this.lowerRadiusLimit || 0);
        this.radius = distance * this.zoomOnFactor;
        if (this.mode === Camera.ORTHOGRAPHIC_CAMERA) {
            const aspectRatio = this.getScene().getEngine().getAspectRatio(this);
            const orthoExtent = (distance * this.zoomOnFactor) / 2;
            this.orthoLeft = -orthoExtent * aspectRatio;
            this.orthoRight = orthoExtent * aspectRatio;
            this.orthoBottom = -orthoExtent;
            this.orthoTop = orthoExtent;
        }
        this.focusOn({ min: minMaxVector.min, max: minMaxVector.max, distance: distance }, doNotUpdateMaxZ);
    }
    /**
     * Focus on a mesh or a bounding box. This adapts the target and maxRadius if necessary but does not update the current radius.
     * The target will be changed but the radius
     * @param meshesOrMinMaxVectorAndDistance Defines the mesh or bounding info to focus on
     * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
     */
    focusOn(meshesOrMinMaxVectorAndDistance, doNotUpdateMaxZ = false) {
        let meshesOrMinMaxVector;
        let distance;
        if (meshesOrMinMaxVectorAndDistance.min === undefined) {
            // meshes
            const meshes = meshesOrMinMaxVectorAndDistance || this.getScene().meshes;
            meshesOrMinMaxVector = Mesh.MinMax(meshes);
            distance = Vector3.Distance(meshesOrMinMaxVector.min, meshesOrMinMaxVector.max);
        }
        else {
            //minMaxVector and distance
            const minMaxVectorAndDistance = meshesOrMinMaxVectorAndDistance;
            meshesOrMinMaxVector = minMaxVectorAndDistance;
            distance = minMaxVectorAndDistance.distance;
        }
        this._target = Mesh.Center(meshesOrMinMaxVector);
        if (!doNotUpdateMaxZ) {
            this.maxZ = distance * 2;
        }
    }
    /**
     * @override
     * Override Camera.createRigCamera
     * @param name the name of the camera
     * @param cameraIndex the index of the camera in the rig cameras array
     */
    createRigCamera(name, cameraIndex) {
        let alphaShift = 0;
        switch (this.cameraRigMode) {
            case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
            case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
            case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
            case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED:
            case Camera.RIG_MODE_VR:
                alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? 1 : -1);
                break;
            case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? -1 : 1);
                break;
        }
        const rigCam = new ArcRotateCamera(name, this.alpha + alphaShift, this.beta, this.radius, this._target, this.getScene());
        rigCam._cameraRigParams = {};
        rigCam.isRigCamera = true;
        rigCam.rigParent = this;
        rigCam.upVector = this.upVector;
        rigCam.mode = this.mode;
        rigCam.orthoLeft = this.orthoLeft;
        rigCam.orthoRight = this.orthoRight;
        rigCam.orthoBottom = this.orthoBottom;
        rigCam.orthoTop = this.orthoTop;
        return rigCam;
    }
    /**
     * @internal
     * @override
     * Override Camera._updateRigCameras
     */
    _updateRigCameras() {
        const camLeft = this._rigCameras[0];
        const camRight = this._rigCameras[1];
        camLeft.beta = camRight.beta = this.beta;
        switch (this.cameraRigMode) {
            case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
            case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
            case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
            case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED:
            case Camera.RIG_MODE_VR:
                camLeft.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
                camRight.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
                break;
            case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                camLeft.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
                camRight.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
                break;
        }
        super._updateRigCameras();
    }
    /**
     * @internal
     */
    _calculateLowerRadiusFromModelBoundingSphere(minimumWorld, maximumWorld, radiusScale = 1) {
        const boxVectorGlobalDiagonal = Vector3.Distance(minimumWorld, maximumWorld);
        // Get aspect ratio in order to calculate frustum slope
        const engine = this.getScene().getEngine();
        const aspectRatio = engine.getAspectRatio(this);
        const frustumSlopeY = Math.tan(this.fov / 2);
        const frustumSlopeX = frustumSlopeY * aspectRatio;
        // Formula for setting distance
        // (Good explanation: http://stackoverflow.com/questions/2866350/move-camera-to-fit-3d-scene)
        const radiusWithoutFraming = boxVectorGlobalDiagonal * 0.5;
        // Horizon distance
        const radius = radiusWithoutFraming * radiusScale;
        const distanceForHorizontalFrustum = radius * Math.sqrt(1.0 + 1.0 / (frustumSlopeX * frustumSlopeX));
        const distanceForVerticalFrustum = radius * Math.sqrt(1.0 + 1.0 / (frustumSlopeY * frustumSlopeY));
        return Math.max(distanceForHorizontalFrustum, distanceForVerticalFrustum);
    }
    /**
     * Destroy the camera and release the current resources hold by it.
     */
    dispose() {
        this.inputs.clear();
        super.dispose();
    }
    /**
     * Gets the current object class name.
     * @returns the class name
     */
    getClassName() {
        return "ArcRotateCamera";
    }
}
__decorate([
    serialize()
], ArcRotateCamera.prototype, "alpha", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "beta", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "radius", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "overrideCloneAlphaBetaRadius", void 0);
__decorate([
    serializeAsVector3("target")
], ArcRotateCamera.prototype, "_target", void 0);
__decorate([
    serializeAsMeshReference("targetHost")
], ArcRotateCamera.prototype, "_targetHost", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "inertialAlphaOffset", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "inertialBetaOffset", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "inertialRadiusOffset", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "lowerAlphaLimit", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "upperAlphaLimit", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "lowerBetaLimit", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "upperBetaLimit", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "lowerRadiusLimit", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "upperRadiusLimit", void 0);
__decorate([
    serialize()
    // eslint-disable-next-line @typescript-eslint/naming-convention
], ArcRotateCamera.prototype, "lowerTargetYLimit", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "inertialPanningX", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "inertialPanningY", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "pinchToPanMaxDistance", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "panningDistanceLimit", void 0);
__decorate([
    serializeAsVector3()
], ArcRotateCamera.prototype, "panningOriginTarget", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "panningInertia", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "zoomToMouseLocation", null);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "zoomOnFactor", void 0);
__decorate([
    serializeAsVector2()
], ArcRotateCamera.prototype, "targetScreenOffset", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "allowUpsideDown", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "useInputToRestoreState", void 0);
__decorate([
    serialize()
], ArcRotateCamera.prototype, "restoreStateInterpolationFactor", void 0);
// Register Class Name
RegisterClass("BABYLON.ArcRotateCamera", ArcRotateCamera);
//# sourceMappingURL=arcRotateCamera.js.map