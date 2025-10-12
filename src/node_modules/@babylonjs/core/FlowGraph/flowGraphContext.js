import { __decorate } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { RandomGUID } from "../Misc/guid.js";
import { defaultValueSerializationFunction } from "./serialization.js";
import { Observable } from "../Misc/observable.js";
import { GetFlowGraphAssetWithType } from "./flowGraphAssetsContext.js";
import { FlowGraphLogger } from "./flowGraphLogger.js";
/**
 * The context represents the current state and execution of the flow graph.
 * It contains both user-defined variables, which are derived from
 * a more general variable definition, and execution variables that
 * are set by the blocks.
 */
export class FlowGraphContext {
    /**
     * Enable logging on this context
     */
    get enableLogging() {
        return this._enableLogging;
    }
    set enableLogging(value) {
        if (this._enableLogging === value) {
            return;
        }
        this._enableLogging = value;
        if (this._enableLogging) {
            this.logger = new FlowGraphLogger();
            this.logger.logToConsole = true;
        }
        else {
            this.logger = null;
        }
    }
    constructor(params) {
        /**
         * A randomly generated GUID for each context.
         */
        this.uniqueId = RandomGUID();
        /**
         * These are the variables defined by a user.
         */
        this._userVariables = {};
        /**
         * These are the variables set by the blocks.
         */
        this._executionVariables = {};
        /**
         * A context-specific global variables, available to all blocks in the context.
         */
        this._globalContextVariables = {};
        /**
         * These are the values for the data connection points
         */
        this._connectionValues = {};
        /**
         * These are blocks that have currently pending tasks/listeners that need to be cleaned up.
         */
        this._pendingBlocks = [];
        /**
         * A monotonically increasing ID for each execution.
         * Incremented for every block executed.
         */
        this._executionId = 0;
        /**
         * Observable that is triggered when a node is executed.
         */
        this.onNodeExecutedObservable = new Observable();
        /**
         * Whether to treat data as right-handed.
         * This is used when serializing data from a right-handed system, while running the context in a left-handed system, for example in glTF parsing.
         * Default is false.
         */
        this.treatDataAsRightHanded = false;
        this._enableLogging = false;
        this._configuration = params;
        this.assetsContext = params.assetsContext ?? params.scene;
    }
    /**
     * Check if a user-defined variable is defined.
     * @param name the name of the variable
     * @returns true if the variable is defined
     */
    hasVariable(name) {
        return name in this._userVariables;
    }
    /**
     * Set a user-defined variable.
     * @param name the name of the variable
     * @param value the value of the variable
     */
    setVariable(name, value) {
        this._userVariables[name] = value;
        this.logger?.addLogItem({
            time: Date.now(),
            className: this.getClassName(),
            uniqueId: this.uniqueId,
            action: "ContextVariableSet" /* FlowGraphAction.ContextVariableSet */,
            payload: {
                name,
                value,
            },
        });
    }
    /**
     * Get an assets from the assets context based on its type and index in the array
     * @param type The type of the asset
     * @param index The index of the asset
     * @returns The asset or null if not found
     */
    getAsset(type, index) {
        return GetFlowGraphAssetWithType(this.assetsContext, type, index);
    }
    /**
     * Get a user-defined variable.
     * @param name the name of the variable
     * @returns the value of the variable
     */
    getVariable(name) {
        this.logger?.addLogItem({
            time: Date.now(),
            className: this.getClassName(),
            uniqueId: this.uniqueId,
            action: "ContextVariableGet" /* FlowGraphAction.ContextVariableGet */,
            payload: {
                name,
                value: this._userVariables[name],
            },
        });
        return this._userVariables[name];
    }
    /**
     * Gets all user variables map
     */
    get userVariables() {
        return this._userVariables;
    }
    /**
     * Get the scene that the context belongs to.
     * @returns the scene
     */
    getScene() {
        return this._configuration.scene;
    }
    _getUniqueIdPrefixedName(obj, name) {
        return `${obj.uniqueId}_${name}`;
    }
    /**
     * @internal
     * @param name name of the variable
     * @param defaultValue default value to return if the variable is not defined
     * @returns the variable value or the default value if the variable is not defined
     */
    _getGlobalContextVariable(name, defaultValue) {
        this.logger?.addLogItem({
            time: Date.now(),
            className: this.getClassName(),
            uniqueId: this.uniqueId,
            action: "GlobalVariableGet" /* FlowGraphAction.GlobalVariableGet */,
            payload: {
                name,
                defaultValue,
                possibleValue: this._globalContextVariables[name],
            },
        });
        if (this._hasGlobalContextVariable(name)) {
            return this._globalContextVariables[name];
        }
        else {
            return defaultValue;
        }
    }
    /**
     * Set a global context variable
     * @internal
     * @param name the name of the variable
     * @param value the value of the variable
     */
    _setGlobalContextVariable(name, value) {
        this.logger?.addLogItem({
            time: Date.now(),
            className: this.getClassName(),
            uniqueId: this.uniqueId,
            action: "GlobalVariableSet" /* FlowGraphAction.GlobalVariableSet */,
            payload: { name, value },
        });
        this._globalContextVariables[name] = value;
    }
    /**
     * Delete a global context variable
     * @internal
     * @param name the name of the variable
     */
    _deleteGlobalContextVariable(name) {
        this.logger?.addLogItem({
            time: Date.now(),
            className: this.getClassName(),
            uniqueId: this.uniqueId,
            action: "GlobalVariableDelete" /* FlowGraphAction.GlobalVariableDelete */,
            payload: { name },
        });
        delete this._globalContextVariables[name];
    }
    /**
     * Check if a global context variable is defined
     * @internal
     * @param name the name of the variable
     * @returns true if the variable is defined
     */
    _hasGlobalContextVariable(name) {
        return name in this._globalContextVariables;
    }
    /**
     * Set an internal execution variable
     * @internal
     * @param name
     * @param value
     */
    _setExecutionVariable(block, name, value) {
        this._executionVariables[this._getUniqueIdPrefixedName(block, name)] = value;
    }
    /**
     * Get an internal execution variable
     * @internal
     * @param name
     * @returns
     */
    _getExecutionVariable(block, name, defaultValue) {
        if (this._hasExecutionVariable(block, name)) {
            return this._executionVariables[this._getUniqueIdPrefixedName(block, name)];
        }
        else {
            return defaultValue;
        }
    }
    /**
     * Delete an internal execution variable
     * @internal
     * @param block
     * @param name
     */
    _deleteExecutionVariable(block, name) {
        delete this._executionVariables[this._getUniqueIdPrefixedName(block, name)];
    }
    /**
     * Check if an internal execution variable is defined
     * @internal
     * @param block
     * @param name
     * @returns
     */
    _hasExecutionVariable(block, name) {
        return this._getUniqueIdPrefixedName(block, name) in this._executionVariables;
    }
    /**
     * Check if a connection value is defined
     * @internal
     * @param connectionPoint
     * @returns
     */
    _hasConnectionValue(connectionPoint) {
        return connectionPoint.uniqueId in this._connectionValues;
    }
    /**
     * Set a connection value
     * @internal
     * @param connectionPoint
     * @param value
     */
    _setConnectionValue(connectionPoint, value) {
        this._connectionValues[connectionPoint.uniqueId] = value;
        this.logger?.addLogItem({
            time: Date.now(),
            className: this.getClassName(),
            uniqueId: this.uniqueId,
            action: "SetConnectionValue" /* FlowGraphAction.SetConnectionValue */,
            payload: {
                connectionPointId: connectionPoint.uniqueId,
                value,
            },
        });
    }
    /**
     * Set a connection value by key
     * @internal
     * @param key the key of the connection value
     * @param value the value of the connection
     */
    _setConnectionValueByKey(key, value) {
        this._connectionValues[key] = value;
    }
    /**
     * Get a connection value
     * @internal
     * @param connectionPoint
     * @returns
     */
    _getConnectionValue(connectionPoint) {
        this.logger?.addLogItem({
            time: Date.now(),
            className: this.getClassName(),
            uniqueId: this.uniqueId,
            action: "GetConnectionValue" /* FlowGraphAction.GetConnectionValue */,
            payload: {
                connectionPointId: connectionPoint.uniqueId,
                value: this._connectionValues[connectionPoint.uniqueId],
            },
        });
        return this._connectionValues[connectionPoint.uniqueId];
    }
    /**
     * Get the configuration
     * @internal
     * @param name
     * @param value
     */
    get configuration() {
        return this._configuration;
    }
    /**
     * Check if there are any pending blocks in this context
     * @returns true if there are pending blocks
     */
    get hasPendingBlocks() {
        return this._pendingBlocks.length > 0;
    }
    /**
     * Add a block to the list of blocks that have pending tasks.
     * @internal
     * @param block
     */
    _addPendingBlock(block) {
        // check if block is already in the array
        if (this._pendingBlocks.includes(block)) {
            return;
        }
        this._pendingBlocks.push(block);
        // sort pending blocks by priority
        this._pendingBlocks.sort((a, b) => a.priority - b.priority);
    }
    /**
     * Remove a block from the list of blocks that have pending tasks.
     * @internal
     * @param block
     */
    _removePendingBlock(block) {
        const index = this._pendingBlocks.indexOf(block);
        if (index !== -1) {
            this._pendingBlocks.splice(index, 1);
        }
    }
    /**
     * Clear all pending blocks.
     * @internal
     */
    _clearPendingBlocks() {
        for (const block of this._pendingBlocks) {
            block._cancelPendingTasks(this);
        }
        this._pendingBlocks.length = 0;
    }
    /**
     * @internal
     * Function that notifies the node executed observable
     * @param node
     */
    _notifyExecuteNode(node) {
        this.onNodeExecutedObservable.notifyObservers(node);
        this.logger?.addLogItem({
            time: Date.now(),
            className: node.getClassName(),
            uniqueId: node.uniqueId,
            action: "ExecuteBlock" /* FlowGraphAction.ExecuteBlock */,
        });
    }
    _notifyOnTick(framePayload) {
        // set the values as global variables
        this._setGlobalContextVariable("timeSinceStart", framePayload.timeSinceStart);
        this._setGlobalContextVariable("deltaTime", framePayload.deltaTime);
        // iterate the pending blocks and run each one's onFrame function
        for (const block of this._pendingBlocks) {
            block._executeOnTick?.(this);
        }
    }
    /**
     * @internal
     */
    _increaseExecutionId() {
        this._executionId++;
    }
    /**
     * A monotonically increasing ID for each execution.
     * Incremented for every block executed.
     */
    get executionId() {
        return this._executionId;
    }
    /**
     * Serializes a context
     * @param serializationObject the object to write the values in
     * @param valueSerializationFunction a function to serialize complex values
     */
    serialize(serializationObject = {}, valueSerializationFunction = defaultValueSerializationFunction) {
        serializationObject.uniqueId = this.uniqueId;
        serializationObject._userVariables = {};
        for (const key in this._userVariables) {
            valueSerializationFunction(key, this._userVariables[key], serializationObject._userVariables);
        }
        serializationObject._connectionValues = {};
        for (const key in this._connectionValues) {
            valueSerializationFunction(key, this._connectionValues[key], serializationObject._connectionValues);
        }
        // serialize assets context, if not scene
        if (this.assetsContext !== this.getScene()) {
            serializationObject._assetsContext = {
                meshes: this.assetsContext.meshes.map((m) => m.id),
                materials: this.assetsContext.materials.map((m) => m.id),
                textures: this.assetsContext.textures.map((m) => m.name),
                animations: this.assetsContext.animations.map((m) => m.name),
                lights: this.assetsContext.lights.map((m) => m.id),
                cameras: this.assetsContext.cameras.map((m) => m.id),
                sounds: this.assetsContext.sounds?.map((m) => m.name),
                skeletons: this.assetsContext.skeletons.map((m) => m.id),
                particleSystems: this.assetsContext.particleSystems.map((m) => m.name),
                geometries: this.assetsContext.geometries.map((m) => m.id),
                multiMaterials: this.assetsContext.multiMaterials.map((m) => m.id),
                transformNodes: this.assetsContext.transformNodes.map((m) => m.id),
            };
        }
    }
    /**
     * @returns the class name of the object.
     */
    getClassName() {
        return "FlowGraphContext";
    }
}
__decorate([
    serialize()
], FlowGraphContext.prototype, "uniqueId", void 0);
//# sourceMappingURL=flowGraphContext.js.map