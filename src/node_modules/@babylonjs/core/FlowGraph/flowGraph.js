import { Observable } from "../Misc/observable.js";
import { FlowGraphContext } from "./flowGraphContext.js";
import { FlowGraphExecutionBlock } from "./flowGraphExecutionBlock.js";
import { FlowGraphSceneEventCoordinator } from "./flowGraphSceneEventCoordinator.js";
import { _IsDescendantOf } from "./utils.js";
export var FlowGraphState;
(function (FlowGraphState) {
    /**
     * The graph is stopped
     */
    FlowGraphState[FlowGraphState["Stopped"] = 0] = "Stopped";
    /**
     * The graph is running
     */
    FlowGraphState[FlowGraphState["Started"] = 1] = "Started";
})(FlowGraphState || (FlowGraphState = {}));
/**
 * Class used to represent a flow graph.
 * A flow graph is a graph of blocks that can be used to create complex logic.
 * Blocks can be added to the graph and connected to each other.
 * The graph can then be started, which will init and start all of its event blocks.
 *
 * @experimental FlowGraph is still in development and is subject to change.
 */
export class FlowGraph {
    /**
     * The state of the graph
     */
    get state() {
        return this._state;
    }
    /**
     * The state of the graph
     */
    set state(value) {
        this._state = value;
        this.onStateChangedObservable.notifyObservers(value);
    }
    /**
     * Construct a Flow Graph
     * @param params construction parameters. currently only the scene
     */
    constructor(params) {
        /**
         * An observable that is triggered when the state of the graph changes.
         */
        this.onStateChangedObservable = new Observable();
        /** @internal */
        this._eventBlocks = {
            ["SceneReady" /* FlowGraphEventType.SceneReady */]: [],
            ["SceneDispose" /* FlowGraphEventType.SceneDispose */]: [],
            ["SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */]: [],
            ["MeshPick" /* FlowGraphEventType.MeshPick */]: [],
            ["PointerDown" /* FlowGraphEventType.PointerDown */]: [],
            ["PointerUp" /* FlowGraphEventType.PointerUp */]: [],
            ["PointerMove" /* FlowGraphEventType.PointerMove */]: [],
            ["PointerOver" /* FlowGraphEventType.PointerOver */]: [],
            ["PointerOut" /* FlowGraphEventType.PointerOut */]: [],
            ["SceneAfterRender" /* FlowGraphEventType.SceneAfterRender */]: [],
            ["NoTrigger" /* FlowGraphEventType.NoTrigger */]: [],
        };
        this._executionContexts = [];
        /**
         * The state of the graph
         */
        this._state = 0 /* FlowGraphState.Stopped */;
        this._scene = params.scene;
        this._sceneEventCoordinator = new FlowGraphSceneEventCoordinator(this._scene);
        this._coordinator = params.coordinator;
        this._eventObserver = this._sceneEventCoordinator.onEventTriggeredObservable.add((event) => {
            for (const context of this._executionContexts) {
                const order = this._getContextualOrder(event.type, context);
                for (const block of order) {
                    // iterate contexts
                    if (!block._executeEvent(context, event.payload)) {
                        break;
                    }
                }
            }
            // custom behavior(s) of specific events
            switch (event.type) {
                case "SceneReady" /* FlowGraphEventType.SceneReady */:
                    this._sceneEventCoordinator.sceneReadyTriggered = true;
                    break;
                case "SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */:
                    for (const context of this._executionContexts) {
                        context._notifyOnTick(event.payload);
                    }
                    break;
                case "SceneDispose" /* FlowGraphEventType.SceneDispose */:
                    this.dispose();
                    break;
            }
        });
    }
    /**
     * Create a context. A context represents one self contained execution for the graph, with its own variables.
     * @returns the context, where you can get and set variables
     */
    createContext() {
        const context = new FlowGraphContext({ scene: this._scene, coordinator: this._coordinator });
        this._executionContexts.push(context);
        return context;
    }
    /**
     * Returns the execution context at a given index
     * @param index the index of the context
     * @returns the execution context at that index
     */
    getContext(index) {
        return this._executionContexts[index];
    }
    /**
     * Add an event block. When the graph is started, it will start listening to events
     * from the block and execute the graph when they are triggered.
     * @param block the event block to be added
     */
    addEventBlock(block) {
        if (block.type === "PointerOver" /* FlowGraphEventType.PointerOver */ || block.type === "PointerOut" /* FlowGraphEventType.PointerOut */) {
            this._scene.constantlyUpdateMeshUnderPointer = true;
        }
        // don't add if NoTrigger, but still start the pending tasks
        if (block.type !== "NoTrigger" /* FlowGraphEventType.NoTrigger */) {
            this._eventBlocks[block.type].push(block);
        }
        // if already started, sort and add to the pending
        if (this.state === 1 /* FlowGraphState.Started */) {
            for (const context of this._executionContexts) {
                block._startPendingTasks(context);
            }
        }
        else {
            this.onStateChangedObservable.addOnce((state) => {
                if (state === 1 /* FlowGraphState.Started */) {
                    for (const context of this._executionContexts) {
                        block._startPendingTasks(context);
                    }
                }
            });
        }
    }
    /**
     * Starts the flow graph. Initializes the event blocks and starts listening to events.
     */
    start() {
        if (this.state === 1 /* FlowGraphState.Started */) {
            return;
        }
        if (this._executionContexts.length === 0) {
            this.createContext();
        }
        this.onStateChangedObservable.add((state) => {
            if (state === 1 /* FlowGraphState.Started */) {
                this._startPendingEvents();
                // the only event we need to check is the scene ready event. If the scene is already ready when the graph starts, we should start the pending tasks.
                if (this._scene.isReady(true)) {
                    this._sceneEventCoordinator.onEventTriggeredObservable.notifyObservers({ type: "SceneReady" /* FlowGraphEventType.SceneReady */ });
                }
            }
        });
        this.state = 1 /* FlowGraphState.Started */;
    }
    _startPendingEvents() {
        for (const context of this._executionContexts) {
            for (const type in this._eventBlocks) {
                const order = this._getContextualOrder(type, context);
                for (const block of order) {
                    block._startPendingTasks(context);
                }
            }
        }
    }
    _getContextualOrder(type, context) {
        const order = this._eventBlocks[type].sort((a, b) => b.initPriority - a.initPriority);
        if (type === "MeshPick" /* FlowGraphEventType.MeshPick */) {
            const meshPickOrder = [];
            for (const block1 of order) {
                // If the block is a mesh pick, guarantee that picks of children meshes come before picks of parent meshes
                const mesh1 = block1.asset.getValue(context);
                let i = 0;
                for (; i < order.length; i++) {
                    const block2 = order[i];
                    const mesh2 = block2.asset.getValue(context);
                    if (mesh1 && mesh2 && _IsDescendantOf(mesh1, mesh2)) {
                        break;
                    }
                }
                meshPickOrder.splice(i, 0, block1);
            }
            return meshPickOrder;
        }
        return order;
    }
    /**
     * Disposes of the flow graph. Cancels any pending tasks and removes all event listeners.
     */
    dispose() {
        if (this.state === 0 /* FlowGraphState.Stopped */) {
            return;
        }
        this.state = 0 /* FlowGraphState.Stopped */;
        for (const context of this._executionContexts) {
            context._clearPendingBlocks();
        }
        this._executionContexts.length = 0;
        for (const type in this._eventBlocks) {
            this._eventBlocks[type].length = 0;
        }
        this._eventObserver?.remove();
        this._sceneEventCoordinator.dispose();
    }
    /**
     * Executes a function in all blocks of a flow graph, starting with the event blocks.
     * @param visitor the function to execute.
     */
    visitAllBlocks(visitor) {
        const visitList = [];
        const idsAddedToVisitList = new Set();
        for (const type in this._eventBlocks) {
            for (const block of this._eventBlocks[type]) {
                visitList.push(block);
                idsAddedToVisitList.add(block.uniqueId);
            }
        }
        while (visitList.length > 0) {
            const block = visitList.pop();
            visitor(block);
            for (const dataIn of block.dataInputs) {
                for (const connection of dataIn._connectedPoint) {
                    if (!idsAddedToVisitList.has(connection._ownerBlock.uniqueId)) {
                        visitList.push(connection._ownerBlock);
                        idsAddedToVisitList.add(connection._ownerBlock.uniqueId);
                    }
                }
            }
            if (block instanceof FlowGraphExecutionBlock) {
                for (const signalOut of block.signalOutputs) {
                    for (const connection of signalOut._connectedPoint) {
                        if (!idsAddedToVisitList.has(connection._ownerBlock.uniqueId)) {
                            visitList.push(connection._ownerBlock);
                            idsAddedToVisitList.add(connection._ownerBlock.uniqueId);
                        }
                    }
                }
            }
        }
    }
    /**
     * Serializes a graph
     * @param serializationObject the object to write the values in
     * @param valueSerializeFunction a function to serialize complex values
     */
    serialize(serializationObject = {}, valueSerializeFunction) {
        serializationObject.allBlocks = [];
        this.visitAllBlocks((block) => {
            const serializedBlock = {};
            block.serialize(serializedBlock);
            serializationObject.allBlocks.push(serializedBlock);
        });
        serializationObject.executionContexts = [];
        for (const context of this._executionContexts) {
            const serializedContext = {};
            context.serialize(serializedContext, valueSerializeFunction);
            serializationObject.executionContexts.push(serializedContext);
        }
    }
}
//# sourceMappingURL=flowGraph.js.map