import type { DeepImmutable } from "../types.js";
import type { IVector2Like, IVector3Like } from "./math.like.js";
import { Quaternion, Vector3 } from "./math.vector.js";
import type { Vector4 } from "./math.vector.js";
/**
 * Creates a string representation of the IVector2Like
 * @param vector defines the IVector2Like to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the IVector2Like coordinates.
 */
export declare function Vector2ToFixed(vector: IVector2Like, decimalCount: number): string;
/**
 * Computes the dot product of two IVector3Like objects.
 * @param a defines the first vector
 * @param b defines the second vector
 * @returns the dot product
 */
export declare function Vector3Dot<T extends IVector3Like, U extends IVector3Like>(a: DeepImmutable<T>, b: DeepImmutable<U>): number;
/**
 * Sets the given floats into the result.
 * @param x defines the x coordinate
 * @param y defines the y coordinate
 * @param z defines the z coordinate
 * @param result defines the target vector
 * @returns the result vector
 */
export declare function Vector3FromFloatsToRef<T extends IVector3Like>(x: number, y: number, z: number, result: T): T;
/**
 * Stores the scaled values of a vector into the result.
 * @param a defines the source vector
 * @param scale defines the scale factor
 * @param result defines the target vector
 * @returns the scaled vector
 */
export declare function Vector3ScaleToRef<T extends IVector3Like, ResultT extends IVector3Like>(a: DeepImmutable<T>, scale: number, result: ResultT): ResultT;
/**
 * Creates a string representation of the Vector3
 * @param vector defines the Vector3 to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the Vector3 coordinates.
 */
export declare function Vector3ToFixed(vector: Vector3, decimalCount: number): string;
/**
 * Creates a string representation of the Vector4
 * @param vector defines the Vector4 to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the Vector4 coordinates.
 */
export declare function Vector4ToFixed(vector: Vector4, decimalCount: number): string;
/**
 * Returns the angle in radians between two quaternions
 * @param q1 defines the first quaternion
 * @param q2 defines the second quaternion
 * @returns the angle in radians between the two quaternions
 */
export declare function GetAngleBetweenQuaternions(q1: DeepImmutable<Quaternion>, q2: DeepImmutable<Quaternion>): number;
/**
 * Creates a quaternion from two direction vectors
 * @param a defines the first direction vector
 * @param b defines the second direction vector
 * @returns the target quaternion
 */
export declare function GetQuaternionFromDirections<T extends Vector3>(a: DeepImmutable<T>, b: DeepImmutable<T>): Quaternion;
/**
 * Creates a quaternion from two direction vectors
 * @param a defines the first direction vector
 * @param b defines the second direction vector
 * @param result defines the target quaternion
 * @returns the target quaternion
 */
export declare function GetQuaternionFromDirectionsToRef<T extends Vector3, ResultT extends Quaternion>(a: DeepImmutable<T>, b: DeepImmutable<T>, result: ResultT): ResultT;
