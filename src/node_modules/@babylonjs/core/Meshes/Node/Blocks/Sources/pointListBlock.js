import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { Vector3 } from "../../../../Maths/math.vector.js";
import { VertexData } from "../../../mesh.vertexData.js";
/**
 * Defines a block used to generate a geometry data from a list of points
 */
export class PointListBlock extends NodeGeometryBlock {
    /**
     * Create a new PointListBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets a list of points used to generate the geometry
         */
        this.points = [];
        this.registerOutput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "PointListBlock";
    }
    /**
     * Gets the geometry output component
     */
    get geometry() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        this.geometry._storedFunction = () => {
            this.geometry._executionCount = 1;
            if (this.points.length === 0) {
                return null;
            }
            const vertexData = new VertexData();
            vertexData.positions = this.points.reduce((acc, point) => {
                acc.push(point.x, point.y, point.z);
                return acc;
            }, []);
            return vertexData;
        };
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.points = [];\n`;
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            codeString += `${this._codeVariableName}.points.push(new BABYLON.Vector3(${point.x}, ${point.y}, ${point.z}));\n`;
        }
        return codeString;
    }
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.points = this.points.map((point) => {
            return point.asArray();
        });
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.points = serializationObject.points.map((point) => {
            return Vector3.FromArray(point);
        });
    }
}
RegisterClass("BABYLON.PointListBlock", PointListBlock);
//# sourceMappingURL=pointListBlock.js.map