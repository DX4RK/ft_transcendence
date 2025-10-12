import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeVector3, RichTypeNumber, RichTypeAny, RichTypeVector2, RichTypeMatrix, getRichTypeByFlowGraphType, RichTypeQuaternion, RichTypeBoolean, } from "../../../flowGraphRichTypes.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { Quaternion, Vector3, Vector4 } from "../../../../Maths/math.vector.js";
import { _GetClassNameOf } from "../../../utils.js";
import { GetAngleBetweenQuaternions, GetQuaternionFromDirections } from "../../../../Maths/math.vector.functions.js";
const AxisCacheName = "cachedOperationAxis";
const AngleCacheName = "cachedOperationAngle";
const CacheExecIdName = "cachedExecutionId";
/**
 * Vector length block.
 */
export class FlowGraphLengthBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeNumber, (a) => this._polymorphicLength(a), "FlowGraphLengthBlock" /* FlowGraphBlockNames.Length */, config);
    }
    _polymorphicLength(a) {
        const aClassName = _GetClassNameOf(a);
        switch (aClassName) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
            case "Vector3" /* FlowGraphTypes.Vector3 */:
            case "Vector4" /* FlowGraphTypes.Vector4 */:
            case "Quaternion" /* FlowGraphTypes.Quaternion */:
                return a.length();
            default:
                throw new Error(`Cannot compute length of value ${a}`);
        }
    }
}
RegisterClass("FlowGraphLengthBlock" /* FlowGraphBlockNames.Length */, FlowGraphLengthBlock);
/**
 * Vector normalize block.
 */
export class FlowGraphNormalizeBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, (a) => this._polymorphicNormalize(a), "FlowGraphNormalizeBlock" /* FlowGraphBlockNames.Normalize */, config);
    }
    _polymorphicNormalize(a) {
        const aClassName = _GetClassNameOf(a);
        let normalized;
        switch (aClassName) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
            case "Vector3" /* FlowGraphTypes.Vector3 */:
            case "Vector4" /* FlowGraphTypes.Vector4 */:
            case "Quaternion" /* FlowGraphTypes.Quaternion */:
                normalized = a.normalizeToNew();
                if (this.config?.nanOnZeroLength) {
                    const length = a.length();
                    if (length === 0) {
                        normalized.setAll(NaN);
                    }
                }
                return normalized;
            default:
                throw new Error(`Cannot normalize value ${a}`);
        }
    }
}
RegisterClass("FlowGraphNormalizeBlock" /* FlowGraphBlockNames.Normalize */, FlowGraphNormalizeBlock);
/**
 * Dot product block.
 */
export class FlowGraphDotBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeAny, RichTypeAny, RichTypeNumber, (a, b) => this._polymorphicDot(a, b), "FlowGraphDotBlock" /* FlowGraphBlockNames.Dot */, config);
    }
    _polymorphicDot(a, b) {
        const className = _GetClassNameOf(a);
        switch (className) {
            case "Vector2" /* FlowGraphTypes.Vector2 */:
            case "Vector3" /* FlowGraphTypes.Vector3 */:
            case "Vector4" /* FlowGraphTypes.Vector4 */:
            case "Quaternion" /* FlowGraphTypes.Quaternion */:
                // casting is needed because dot requires both to be the same type
                return a.dot(b);
            default:
                throw new Error(`Cannot get dot product of ${a} and ${b}`);
        }
    }
}
RegisterClass("FlowGraphDotBlock" /* FlowGraphBlockNames.Dot */, FlowGraphDotBlock);
/**
 * Cross product block.
 */
export class FlowGraphCrossBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeVector3, RichTypeVector3, (a, b) => Vector3.Cross(a, b), "FlowGraphCrossBlock" /* FlowGraphBlockNames.Cross */, config);
    }
}
RegisterClass("FlowGraphCrossBlock" /* FlowGraphBlockNames.Cross */, FlowGraphCrossBlock);
/**
 * 2D rotation block.
 */
export class FlowGraphRotate2DBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector2, RichTypeNumber, RichTypeVector2, (a, b) => a.rotate(b), "FlowGraphRotate2DBlock" /* FlowGraphBlockNames.Rotate2D */, config);
    }
}
RegisterClass("FlowGraphRotate2DBlock" /* FlowGraphBlockNames.Rotate2D */, FlowGraphRotate2DBlock);
/**
 * 3D rotation block.
 */
export class FlowGraphRotate3DBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeQuaternion, RichTypeVector3, (a, b) => a.applyRotationQuaternion(b), "FlowGraphRotate3DBlock" /* FlowGraphBlockNames.Rotate3D */, config);
    }
}
RegisterClass("FlowGraphRotate3DBlock" /* FlowGraphBlockNames.Rotate3D */, FlowGraphRotate3DBlock);
function TransformVector(a, b) {
    const className = _GetClassNameOf(a);
    switch (className) {
        case "Vector2" /* FlowGraphTypes.Vector2 */:
            return b.transformVector(a);
        case "Vector3" /* FlowGraphTypes.Vector3 */:
            return b.transformVector(a);
        case "Vector4" /* FlowGraphTypes.Vector4 */:
            a = a;
            // transform the vector 4 with the matrix here. Vector4.TransformCoordinates transforms a 3D coordinate, not Vector4
            return new Vector4(a.x * b.m[0] + a.y * b.m[1] + a.z * b.m[2] + a.w * b.m[3], a.x * b.m[4] + a.y * b.m[5] + a.z * b.m[6] + a.w * b.m[7], a.x * b.m[8] + a.y * b.m[9] + a.z * b.m[10] + a.w * b.m[11], a.x * b.m[12] + a.y * b.m[13] + a.z * b.m[14] + a.w * b.m[15]);
        default:
            throw new Error(`Cannot transform value ${a}`);
    }
}
/**
 * Transform a vector3 by a matrix.
 */
export class FlowGraphTransformBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        const vectorType = config?.vectorType || "Vector3" /* FlowGraphTypes.Vector3 */;
        const matrixType = vectorType === "Vector2" /* FlowGraphTypes.Vector2 */ ? "Matrix2D" /* FlowGraphTypes.Matrix2D */ : vectorType === "Vector3" /* FlowGraphTypes.Vector3 */ ? "Matrix3D" /* FlowGraphTypes.Matrix3D */ : "Matrix" /* FlowGraphTypes.Matrix */;
        super(getRichTypeByFlowGraphType(vectorType), getRichTypeByFlowGraphType(matrixType), getRichTypeByFlowGraphType(vectorType), TransformVector, "FlowGraphTransformVectorBlock" /* FlowGraphBlockNames.TransformVector */, config);
    }
}
RegisterClass("FlowGraphTransformVectorBlock" /* FlowGraphBlockNames.TransformVector */, FlowGraphTransformBlock);
/**
 * Transform a vector3 by a matrix.
 */
export class FlowGraphTransformCoordinatesBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeMatrix, RichTypeVector3, (a, b) => Vector3.TransformCoordinates(a, b), "FlowGraphTransformCoordinatesBlock" /* FlowGraphBlockNames.TransformCoordinates */, config);
    }
}
RegisterClass("FlowGraphTransformCoordinatesBlock" /* FlowGraphBlockNames.TransformCoordinates */, FlowGraphTransformCoordinatesBlock);
/**
 * Conjugate the quaternion.
 */
export class FlowGraphConjugateBlock extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeQuaternion, RichTypeQuaternion, (a) => a.conjugate(), "FlowGraphConjugateBlock" /* FlowGraphBlockNames.Conjugate */, config);
    }
}
RegisterClass("FlowGraphConjugateBlock" /* FlowGraphBlockNames.Conjugate */, FlowGraphConjugateBlock);
/**
 * Get the angle between two quaternions.
 */
export class FlowGraphAngleBetweenBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeQuaternion, RichTypeQuaternion, RichTypeNumber, (a, b) => GetAngleBetweenQuaternions(a, b), "FlowGraphAngleBetweenBlock" /* FlowGraphBlockNames.AngleBetween */, config);
    }
}
RegisterClass("FlowGraphAngleBetweenBlock" /* FlowGraphBlockNames.AngleBetween */, FlowGraphAngleBetweenBlock);
/**
 * Get the quaternion from an axis and an angle.
 */
export class FlowGraphQuaternionFromAxisAngleBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeNumber, RichTypeQuaternion, (a, b) => Quaternion.RotationAxis(a, b), "FlowGraphQuaternionFromAxisAngleBlock" /* FlowGraphBlockNames.QuaternionFromAxisAngle */, config);
    }
}
RegisterClass("FlowGraphQuaternionFromAxisAngleBlock" /* FlowGraphBlockNames.QuaternionFromAxisAngle */, FlowGraphQuaternionFromAxisAngleBlock);
/**
 * Get the axis and angle from a quaternion.
 */
export class FlowGraphAxisAngleFromQuaternionBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.a = this.registerDataInput("a", RichTypeQuaternion);
        this.axis = this.registerDataOutput("axis", RichTypeVector3);
        this.angle = this.registerDataOutput("angle", RichTypeNumber);
        this.isValid = this.registerDataOutput("isValid", RichTypeBoolean);
    }
    /** @override */
    _updateOutputs(context) {
        const cachedExecutionId = context._getExecutionVariable(this, CacheExecIdName, -1);
        const cachedAxis = context._getExecutionVariable(this, AxisCacheName, null);
        const cachedAngle = context._getExecutionVariable(this, AngleCacheName, null);
        if (cachedAxis !== undefined && cachedAxis !== null && cachedAngle !== undefined && cachedAngle !== null && cachedExecutionId === context.executionId) {
            this.axis.setValue(cachedAxis, context);
            this.angle.setValue(cachedAngle, context);
        }
        else {
            try {
                const { axis, angle } = this.a.getValue(context).toAxisAngle();
                context._setExecutionVariable(this, AxisCacheName, axis);
                context._setExecutionVariable(this, AngleCacheName, angle);
                context._setExecutionVariable(this, CacheExecIdName, context.executionId);
                this.axis.setValue(axis, context);
                this.angle.setValue(angle, context);
                this.isValid.setValue(true, context);
            }
            catch (e) {
                this.isValid.setValue(false, context);
            }
        }
    }
    /** @override */
    getClassName() {
        return "FlowGraphAxisAngleFromQuaternionBlock" /* FlowGraphBlockNames.AxisAngleFromQuaternion */;
    }
}
RegisterClass("FlowGraphAxisAngleFromQuaternionBlock" /* FlowGraphBlockNames.AxisAngleFromQuaternion */, FlowGraphAxisAngleFromQuaternionBlock);
/**
 * Get the quaternion from two direction vectors.
 */
export class FlowGraphQuaternionFromDirectionsBlock extends FlowGraphBinaryOperationBlock {
    constructor(config) {
        super(RichTypeVector3, RichTypeVector3, RichTypeQuaternion, (a, b) => GetQuaternionFromDirections(a, b), "FlowGraphQuaternionFromDirectionsBlock" /* FlowGraphBlockNames.QuaternionFromDirections */, config);
    }
}
//# sourceMappingURL=flowGraphVectorMathBlocks.js.map