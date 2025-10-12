import { PointerEventTypes } from "../Events/pointerEvents.js";
import { Observable } from "../Misc/observable.js";
/**
 * This class is responsible for coordinating the events that are triggered in the scene.
 * It registers all observers needed to track certain events and triggers the blocks that are listening to them.
 * Abstracting the events from the class will allow us to easily change the events that are being listened to, and trigger them in any order.
 */
export class FlowGraphSceneEventCoordinator {
    constructor(scene) {
        /**
         * register to this observable to get flow graph event notifications.
         */
        this.onEventTriggeredObservable = new Observable();
        /**
         * Was scene-ready already triggered?
         */
        this.sceneReadyTriggered = false;
        this._pointerUnderMeshState = {};
        this._startingTime = 0;
        this._scene = scene;
        this._initialize();
    }
    _initialize() {
        this._sceneReadyObserver = this._scene.onReadyObservable.add(() => {
            if (!this.sceneReadyTriggered) {
                this.onEventTriggeredObservable.notifyObservers({ type: "SceneReady" /* FlowGraphEventType.SceneReady */ });
                this.sceneReadyTriggered = true;
            }
        });
        this._sceneDisposeObserver = this._scene.onDisposeObservable.add(() => {
            this.onEventTriggeredObservable.notifyObservers({ type: "SceneDispose" /* FlowGraphEventType.SceneDispose */ });
        });
        this._sceneOnBeforeRenderObserver = this._scene.onBeforeRenderObservable.add(() => {
            const deltaTime = this._scene.getEngine().getDeltaTime() / 1000; // set in seconds
            this.onEventTriggeredObservable.notifyObservers({
                type: "SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */,
                payload: {
                    timeSinceStart: this._startingTime,
                    deltaTime,
                },
            });
            this._startingTime += deltaTime;
        });
        this._meshPickedObserver = this._scene.onPointerObservable.add((pointerInfo) => {
            this.onEventTriggeredObservable.notifyObservers({ type: "MeshPick" /* FlowGraphEventType.MeshPick */, payload: pointerInfo });
        }, PointerEventTypes.POINTERPICK); // should it be pointerdown?
        this._meshUnderPointerObserver = this._scene.onMeshUnderPointerUpdatedObservable.add((data) => {
            // check if the data has changed. Check the state of the last change and see if it is a mesh or null.
            // if it is a mesh and the previous state was null, trigger over event. If it is null and the previous state was a mesh, trigger out event.
            // if it is a mesh and the previous state was a mesh, trigger out from the old mesh and over the new mesh
            // if it is null and the previous state was null, do nothing.
            const pointerId = data.pointerId;
            const mesh = data.mesh;
            const previousState = this._pointerUnderMeshState[pointerId];
            if (!previousState && mesh) {
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOver" /* FlowGraphEventType.PointerOver */, payload: { pointerId, mesh } });
            }
            else if (previousState && !mesh) {
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOut" /* FlowGraphEventType.PointerOut */, payload: { pointerId, mesh: previousState } });
            }
            else if (previousState && mesh && previousState !== mesh) {
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOut" /* FlowGraphEventType.PointerOut */, payload: { pointerId, mesh: previousState, over: mesh } });
                this.onEventTriggeredObservable.notifyObservers({ type: "PointerOver" /* FlowGraphEventType.PointerOver */, payload: { pointerId, mesh, out: previousState } });
            }
            this._pointerUnderMeshState[pointerId] = mesh;
        }, PointerEventTypes.POINTERMOVE);
    }
    dispose() {
        this._sceneDisposeObserver?.remove();
        this._sceneReadyObserver?.remove();
        this._sceneOnBeforeRenderObserver?.remove();
        this._meshPickedObserver?.remove();
        this._meshUnderPointerObserver?.remove();
        this.onEventTriggeredObservable.clear();
    }
}
//# sourceMappingURL=flowGraphSceneEventCoordinator.js.map