import type { Nullable } from "../types.js";
import { Scene } from "../scene.js";
import { Vector3 } from "../Maths/math.vector.js";
import { Collider } from "./collider.js";
import type { AbstractMesh } from "../Meshes/abstractMesh.js";
/** @internal */
export interface ICollisionCoordinator {
    createCollider(): Collider;
    getNewPosition(position: Vector3, displacement: Vector3, collider: Collider, maximumRetry: number, excludedMesh: Nullable<AbstractMesh>, onNewPosition: (collisionIndex: number, newPosition: Vector3, collidedMesh: Nullable<AbstractMesh>) => void, collisionIndex: number, slideOnCollide?: boolean): void;
    init(scene: Scene): void;
}
/** @internal */
export declare class DefaultCollisionCoordinator implements ICollisionCoordinator {
    private _scene;
    private _scaledPosition;
    private _scaledVelocity;
    private _finalPosition;
    getNewPosition(position: Vector3, displacement: Vector3, collider: Collider, maximumRetry: number, excludedMesh: AbstractMesh, onNewPosition: (collisionIndex: number, newPosition: Vector3, collidedMesh: Nullable<AbstractMesh>) => void, collisionIndex: number, slideOnCollide?: boolean): void;
    createCollider(): Collider;
    init(scene: Scene): void;
    private _collideWithWorld;
}
