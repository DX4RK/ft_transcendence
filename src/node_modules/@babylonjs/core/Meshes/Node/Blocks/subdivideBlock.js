import { __decorate } from "../../../tslib.es6.js";
import { Subdivide } from "../../mesh.vertexData.subdivide.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
/**
 * Block used to subdivide for a geometry using Catmull-Clark algorithm
 */
export class SubdivideBlock extends NodeGeometryBlock {
    /**
     * Creates a new ComputeNormalsBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets a boolean indicating that this block can evaluate context
         */
        this.flatOnly = false;
        /**
         * Gets or sets a float defining the loop weight. i.e how much to weigh favoring heavy corners vs favoring Loop's formula
         */
        this.loopWeight = 1.0;
        this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
        this.registerInput("level", NodeGeometryBlockConnectionPointTypes.Int, true, 1, 0, 8);
        this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "SubdivideBlock";
    }
    /**
     * Gets the geometry component
     */
    get geometry() {
        return this._inputs[0];
    }
    /**
     * Gets the level component
     */
    get level() {
        return this._inputs[1];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock() {
        this.output._storedFunction = (state) => {
            if (!this.geometry.isConnected) {
                return null;
            }
            const vertexData = this.geometry.getConnectedValue(state);
            if (!vertexData) {
                return null;
            }
            const level = this.level.getConnectedValue(state);
            return Subdivide(vertexData, level, {
                flatOnly: this.flatOnly,
                weight: this.loopWeight,
            });
        };
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.flatOnly = ${this.flatOnly ? "true" : "false"};\n`;
        codeString += `${this._codeVariableName}.loopWeight = ${this.loopWeight};\n`;
        return codeString;
    }
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.flatOnly = this.flatOnly;
        serializationObject.loopWeight = this.loopWeight;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.flatOnly = serializationObject.flatOnly;
        this.loopWeight = serializationObject.loopWeight;
    }
}
__decorate([
    editableInPropertyPage("Flat Only", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })
], SubdivideBlock.prototype, "flatOnly", void 0);
__decorate([
    editableInPropertyPage("Loop weight", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, min: 0, max: 1, notifiers: { rebuild: true } })
], SubdivideBlock.prototype, "loopWeight", void 0);
RegisterClass("BABYLON.SubdivideBlock", SubdivideBlock);
//# sourceMappingURL=subdivideBlock.js.map