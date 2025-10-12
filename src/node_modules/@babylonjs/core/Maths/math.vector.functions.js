import { Clamp } from "./math.scalar.functions.js";
import { Quaternion, Vector3 } from "./math.vector.js";
/**
 * Creates a string representation of the IVector2Like
 * @param vector defines the IVector2Like to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the IVector2Like coordinates.
 */
export function Vector2ToFixed(vector, decimalCount) {
    return `{X: ${vector.x.toFixed(decimalCount)} Y: ${vector.y.toFixed(decimalCount)}}`;
}
/**
 * Computes the dot product of two IVector3Like objects.
 * @param a defines the first vector
 * @param b defines the second vector
 * @returns the dot product
 */
export function Vector3Dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
/**
 * Sets the given floats into the result.
 * @param x defines the x coordinate
 * @param y defines the y coordinate
 * @param z defines the z coordinate
 * @param result defines the target vector
 * @returns the result vector
 */
export function Vector3FromFloatsToRef(x, y, z, result) {
    result.x = x;
    result.y = y;
    result.z = z;
    return result;
}
/**
 * Stores the scaled values of a vector into the result.
 * @param a defines the source vector
 * @param scale defines the scale factor
 * @param result defines the target vector
 * @returns the scaled vector
 */
export function Vector3ScaleToRef(a, scale, result) {
    result.x = a.x * scale;
    result.y = a.y * scale;
    result.z = a.z * scale;
    return result;
}
/**
 * Creates a string representation of the Vector3
 * @param vector defines the Vector3 to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the Vector3 coordinates.
 */
export function Vector3ToFixed(vector, decimalCount) {
    return `{X: ${vector._x.toFixed(decimalCount)} Y: ${vector._y.toFixed(decimalCount)} Z: ${vector._z.toFixed(decimalCount)}}`;
}
/**
 * Creates a string representation of the Vector4
 * @param vector defines the Vector4 to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the Vector4 coordinates.
 */
export function Vector4ToFixed(vector, decimalCount) {
    return `{X: ${vector.x.toFixed(decimalCount)} Y: ${vector.y.toFixed(decimalCount)} Z: ${vector.z.toFixed(decimalCount)} W: ${vector.w.toFixed(decimalCount)}}`;
}
/**
 * Returns the angle in radians between two quaternions
 * @param q1 defines the first quaternion
 * @param q2 defines the second quaternion
 * @returns the angle in radians between the two quaternions
 */
export function GetAngleBetweenQuaternions(q1, q2) {
    return Math.acos(Clamp(Quaternion.Dot(q1, q2))) * 2;
}
/**
 * Creates a quaternion from two direction vectors
 * @param a defines the first direction vector
 * @param b defines the second direction vector
 * @returns the target quaternion
 */
export function GetQuaternionFromDirections(a, b) {
    const result = new Quaternion();
    GetQuaternionFromDirectionsToRef(a, b, result);
    return result;
}
/**
 * Creates a quaternion from two direction vectors
 * @param a defines the first direction vector
 * @param b defines the second direction vector
 * @param result defines the target quaternion
 * @returns the target quaternion
 */
export function GetQuaternionFromDirectionsToRef(a, b, result) {
    const axis = Vector3.Cross(a, b);
    const angle = Math.acos(Clamp(Vector3Dot(a, b), -1, 1));
    Quaternion.RotationAxisToRef(axis, angle, result);
    return result;
}
//# sourceMappingURL=math.vector.functions.js.map