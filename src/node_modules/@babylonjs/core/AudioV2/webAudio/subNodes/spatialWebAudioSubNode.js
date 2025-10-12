import { Matrix, Quaternion, Vector3 } from "../../../Maths/math.vector.js";
import { _SpatialAudioSubNode } from "../../abstractAudio/subNodes/spatialAudioSubNode.js";
import { _SpatialAudioDefaults } from "../../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _WebAudioParameterComponent } from "../components/webAudioParameterComponent.js";
const TmpMatrix = Matrix.Zero();
const TmpQuaternion = new Quaternion();
const TmpVector = Vector3.Zero();
function D2r(degrees) {
    return (degrees * Math.PI) / 180;
}
function R2d(radians) {
    return (radians * 180) / Math.PI;
}
/** @internal */
// eslint-disable-next-line @typescript-eslint/require-await
export async function _CreateSpatialAudioSubNodeAsync(engine) {
    return new _SpatialWebAudioSubNode(engine);
}
/** @internal */
export class _SpatialWebAudioSubNode extends _SpatialAudioSubNode {
    /** @internal */
    constructor(engine) {
        super(engine);
        this._lastPosition = Vector3.Zero();
        this._lastRotation = Vector3.Zero();
        this._lastRotationQuaternion = new Quaternion();
        /** @internal */
        this.position = _SpatialAudioDefaults.position.clone();
        /** @internal */
        this.rotation = _SpatialAudioDefaults.rotation.clone();
        /** @internal */
        this.rotationQuaternion = _SpatialAudioDefaults.rotationQuaternion.clone();
        this.node = new PannerNode(engine._audioContext);
        this._orientationX = new _WebAudioParameterComponent(engine, this.node.orientationX);
        this._orientationY = new _WebAudioParameterComponent(engine, this.node.orientationY);
        this._orientationZ = new _WebAudioParameterComponent(engine, this.node.orientationZ);
        this._positionX = new _WebAudioParameterComponent(engine, this.node.positionX);
        this._positionY = new _WebAudioParameterComponent(engine, this.node.positionY);
        this._positionZ = new _WebAudioParameterComponent(engine, this.node.positionZ);
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._orientationX.dispose();
        this._orientationY.dispose();
        this._orientationZ.dispose();
        this._positionX.dispose();
        this._positionY.dispose();
        this._positionZ.dispose();
        this.node.disconnect();
    }
    /** @internal */
    get coneInnerAngle() {
        return D2r(this.node.coneInnerAngle);
    }
    set coneInnerAngle(value) {
        this.node.coneInnerAngle = R2d(value);
    }
    /** @internal */
    get coneOuterAngle() {
        return D2r(this.node.coneOuterAngle);
    }
    set coneOuterAngle(value) {
        this.node.coneOuterAngle = R2d(value);
    }
    /** @internal */
    get coneOuterVolume() {
        return this.node.coneOuterGain;
    }
    set coneOuterVolume(value) {
        this.node.coneOuterGain = value;
    }
    /** @internal */
    get distanceModel() {
        return this.node.distanceModel;
    }
    set distanceModel(value) {
        this.node.distanceModel = value;
        // Wiggle the max distance to make the change take effect.
        const maxDistance = this.node.maxDistance;
        this.node.maxDistance = maxDistance + 0.001;
        this.node.maxDistance = maxDistance;
    }
    /** @internal */
    get minDistance() {
        return this.node.refDistance;
    }
    set minDistance(value) {
        this.node.refDistance = value;
    }
    /** @internal */
    get maxDistance() {
        return this.node.maxDistance;
    }
    set maxDistance(value) {
        this.node.maxDistance = value;
    }
    /** @internal */
    get panningModel() {
        return this.node.panningModel;
    }
    set panningModel(value) {
        this.node.panningModel = value;
    }
    /** @internal */
    get rolloffFactor() {
        return this.node.rolloffFactor;
    }
    set rolloffFactor(value) {
        this.node.rolloffFactor = value;
    }
    /** @internal */
    get _inNode() {
        return this.node;
    }
    /** @internal */
    get _outNode() {
        return this.node;
    }
    /** @internal */
    _updatePosition() {
        if (this._lastPosition.equalsWithEpsilon(this.position)) {
            return;
        }
        // If attached and there is a ramp in progress, we assume another update is coming soon that we can wait for.
        // We don't do this for unattached nodes because there may not be another update coming.
        if (this.isAttached && (this._positionX.isRamping || this._positionY.isRamping || this._positionZ.isRamping)) {
            return;
        }
        this._positionX.targetValue = this.position.x;
        this._positionY.targetValue = this.position.y;
        this._positionZ.targetValue = this.position.z;
        this._lastPosition.copyFrom(this.position);
    }
    /** @internal */
    _updateRotation() {
        // If attached and there is a ramp in progress, we assume another update is coming soon that we can wait for.
        // We don't do this for unattached nodes because there may not be another update coming.
        if (this.isAttached && (this._orientationX.isRamping || this._orientationY.isRamping || this._orientationZ.isRamping)) {
            return;
        }
        if (!this._lastRotationQuaternion.equalsWithEpsilon(this.rotationQuaternion)) {
            TmpQuaternion.copyFrom(this.rotationQuaternion);
            this._lastRotationQuaternion.copyFrom(this.rotationQuaternion);
        }
        else if (!this._lastRotation.equalsWithEpsilon(this.rotation)) {
            Quaternion.FromEulerAnglesToRef(this.rotation.x, this.rotation.y, this.rotation.z, TmpQuaternion);
            this._lastRotation.copyFrom(this.rotation);
        }
        else {
            return;
        }
        Matrix.FromQuaternionToRef(TmpQuaternion, TmpMatrix);
        Vector3.TransformNormalToRef(Vector3.RightReadOnly, TmpMatrix, TmpVector);
        this._orientationX.targetValue = TmpVector.x;
        this._orientationY.targetValue = TmpVector.y;
        this._orientationZ.targetValue = TmpVector.z;
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the subgraph.
        if (node._inNode) {
            this.node.connect(node._inNode);
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node._inNode) {
            this.node.disconnect(node._inNode);
        }
        return true;
    }
    /** @internal */
    getClassName() {
        return "_SpatialWebAudioSubNode";
    }
}
//# sourceMappingURL=spatialWebAudioSubNode.js.map