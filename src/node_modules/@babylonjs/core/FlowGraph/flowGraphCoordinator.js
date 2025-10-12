import { Observable } from "../Misc/observable.js";
import { FlowGraph } from "./flowGraph.js";
import { Logger } from "../Misc/logger.js";
/**
 * This class holds all of the existing flow graphs and is responsible for creating new ones.
 * It also handles starting/stopping multiple graphs and communication between them through an Event Coordinator
 * This is the entry point for the flow graph system.
 * @experimental This class is still in development and is subject to change.
 */
export class FlowGraphCoordinator {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        this.config = config;
        /**
         * When set to true (default) custom events will be dispatched synchronously.
         * This means that the events will be dispatched immediately when they are triggered.
         */
        this.dispatchEventsSynchronously = true;
        this._flowGraphs = [];
        this._customEventsMap = new Map();
        this._eventExecutionCounter = new Map();
        this._executeOnNextFrame = [];
        this._eventUniqueId = 0;
        // When the scene is disposed, dispose all graphs currently running on it.
        this._disposeObserver = this.config.scene.onDisposeObservable.add(() => {
            this.dispose();
        });
        this._onBeforeRenderObserver = this.config.scene.onBeforeRenderObservable.add(() => {
            // Reset the event execution counter at the beginning of each frame.
            this._eventExecutionCounter.clear();
            // duplicate the _executeOnNextFrame array to avoid modifying it while iterating over it
            const executeOnNextFrame = this._executeOnNextFrame.slice(0);
            if (executeOnNextFrame.length) {
                // Execute the events that were triggered on the next frame.
                for (const event of executeOnNextFrame) {
                    this.notifyCustomEvent(event.id, event.data, false);
                    // remove the event from the array
                    const index = this._executeOnNextFrame.findIndex((e) => e.uniqueId === event.uniqueId);
                    if (index !== -1) {
                        this._executeOnNextFrame.splice(index, 1);
                    }
                }
            }
        });
        // Add itself to the SceneCoordinators list for the Inspector.
        const coordinators = FlowGraphCoordinator.SceneCoordinators.get(this.config.scene) ?? [];
        coordinators.push(this);
    }
    /**
     * Creates a new flow graph and adds it to the list of existing flow graphs
     * @returns a new flow graph
     */
    createGraph() {
        const graph = new FlowGraph({ scene: this.config.scene, coordinator: this });
        this._flowGraphs.push(graph);
        return graph;
    }
    /**
     * Removes a flow graph from the list of existing flow graphs and disposes it
     * @param graph the graph to remove
     */
    removeGraph(graph) {
        const index = this._flowGraphs.indexOf(graph);
        if (index !== -1) {
            graph.dispose();
            this._flowGraphs.splice(index, 1);
        }
    }
    /**
     * Starts all graphs
     */
    start() {
        for (const graph of this._flowGraphs) {
            graph.start();
        }
    }
    /**
     * Disposes all graphs
     */
    dispose() {
        for (const graph of this._flowGraphs) {
            graph.dispose();
        }
        this._flowGraphs.length = 0;
        this._disposeObserver?.remove();
        this._onBeforeRenderObserver?.remove();
        // Remove itself from the SceneCoordinators list for the Inspector.
        const coordinators = FlowGraphCoordinator.SceneCoordinators.get(this.config.scene) ?? [];
        const index = coordinators.indexOf(this);
        if (index !== -1) {
            coordinators.splice(index, 1);
        }
    }
    /**
     * Serializes this coordinator to a JSON object.
     * @param serializationObject the object to serialize to
     * @param valueSerializeFunction the function to use to serialize the value
     */
    serialize(serializationObject, valueSerializeFunction) {
        serializationObject._flowGraphs = [];
        for (const graph of this._flowGraphs) {
            const serializedGraph = {};
            graph.serialize(serializedGraph, valueSerializeFunction);
            serializationObject._flowGraphs.push(serializedGraph);
        }
        serializationObject.dispatchEventsSynchronously = this.dispatchEventsSynchronously;
    }
    /**
     * Gets the list of flow graphs
     */
    get flowGraphs() {
        return this._flowGraphs;
    }
    /**
     * Get an observable that will be notified when the event with the given id is fired.
     * @param id the id of the event
     * @returns the observable for the event
     */
    getCustomEventObservable(id) {
        let observable = this._customEventsMap.get(id);
        if (!observable) {
            // receive event is initialized before scene start, so no need to notify if triggered. but possible!
            observable = new Observable( /*undefined, true*/);
            this._customEventsMap.set(id, observable);
        }
        return observable;
    }
    /**
     * Notifies the observable for the given event id with the given data.
     * @param id the id of the event
     * @param data the data to send with the event
     * @param async if true, the event will be dispatched asynchronously
     */
    notifyCustomEvent(id, data, async = !this.dispatchEventsSynchronously) {
        if (async) {
            this._executeOnNextFrame.push({ id, data, uniqueId: this._eventUniqueId++ });
            return;
        }
        // check if we are not exceeding the max number of events
        if (this._eventExecutionCounter.has(id)) {
            const count = this._eventExecutionCounter.get(id);
            this._eventExecutionCounter.set(id, count + 1);
            if (count >= FlowGraphCoordinator.MaxEventTypeExecutionPerFrame) {
                if (count === FlowGraphCoordinator.MaxEventTypeExecutionPerFrame) {
                    Logger.Warn(`FlowGraphCoordinator: Too many executions of event "${id}".`);
                }
                return;
            }
        }
        else {
            this._eventExecutionCounter.set(id, 1);
        }
        const observable = this._customEventsMap.get(id);
        if (observable) {
            observable.notifyObservers(data);
        }
    }
}
/**
 * The maximum number of events per type.
 * This is used to limit the number of events that can be created in a single scene.
 * This is to prevent infinite loops.
 */
FlowGraphCoordinator.MaxEventsPerType = 30;
/**
 * The maximum number of execution of a specific event in a single frame.
 */
FlowGraphCoordinator.MaxEventTypeExecutionPerFrame = 30;
/**
 * @internal
 * A list of all the coordinators per scene. Will be used by the inspector
 */
FlowGraphCoordinator.SceneCoordinators = new Map();
//# sourceMappingURL=flowGraphCoordinator.js.map