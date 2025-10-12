import { __decorate } from "../../../../tslib.es6.js";
import { Vector4 } from "../../../../Maths/math.vector.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
/**
 * Block used to fetch a color from texture data
 */
export class GeometryTextureFetchBlock extends NodeGeometryBlock {
    /**
     * Creates a new GeometryTextureFetchBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets a boolean indicating if coordinates should be clamped between 0 and 1
         */
        this.clampCoordinates = true;
        /**
         * Gets or sets a boolean indicating if coordinates should be clamped between 0 and 1
         */
        this.interpolation = true;
        this.registerInput("texture", NodeGeometryBlockConnectionPointTypes.Texture);
        this.registerInput("coordinates", NodeGeometryBlockConnectionPointTypes.Vector2);
        this.registerOutput("rgba", NodeGeometryBlockConnectionPointTypes.Vector4);
        this.registerOutput("rgb", NodeGeometryBlockConnectionPointTypes.Vector3);
        this.registerOutput("r", NodeGeometryBlockConnectionPointTypes.Float);
        this.registerOutput("g", NodeGeometryBlockConnectionPointTypes.Float);
        this.registerOutput("b", NodeGeometryBlockConnectionPointTypes.Float);
        this.registerOutput("a", NodeGeometryBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "GeometryTextureFetchBlock";
    }
    /**
     * Gets the texture component
     */
    get texture() {
        return this.inputs[0];
    }
    /**
     * Gets the coordinates component
     */
    get coordinates() {
        return this.inputs[1];
    }
    /**
     * Gets the rgba component
     */
    get rgba() {
        return this._outputs[0];
    }
    /**
     * Gets the rgb component
     */
    get rgb() {
        return this._outputs[1];
    }
    /**
     * Gets the r component
     */
    get r() {
        return this._outputs[2];
    }
    /**
     * Gets the g component
     */
    get g() {
        return this._outputs[3];
    }
    /**
     * Gets the b component
     */
    get b() {
        return this._outputs[4];
    }
    /**
     * Gets the a component
     */
    get a() {
        return this._outputs[5];
    }
    _repeatClamp(num) {
        if (num >= 0) {
            return num % 1;
        }
        else {
            return 1 - (Math.abs(num) % 1);
        }
    }
    _lerp(a, b, t) {
        return new Vector4(a.x * (1 - t) + b.x * t, a.y * (1 - t) + b.y * t, a.z * (1 - t) + b.z * t, a.w * (1 - t) + b.w * t);
    }
    _getPixel(ix, iy, data, width) {
        const i = (iy * width + ix) * 4;
        return new Vector4(data[i], data[i + 1], data[i + 2], data[i + 3]);
    }
    _buildBlock() {
        const func = (state) => {
            const textureData = this.texture.getConnectedValue(state);
            if (!textureData || !textureData.data) {
                return null;
            }
            const uv = this.coordinates.getConnectedValue(state);
            if (!uv) {
                return null;
            }
            const u = this.clampCoordinates ? Math.max(0, Math.min(uv.x, 1.0)) : this._repeatClamp(uv.x);
            const v = this.clampCoordinates ? Math.max(0, Math.min(uv.y, 1.0)) : this._repeatClamp(uv.y);
            const width = textureData.width;
            const height = textureData.height;
            const data = textureData.data;
            // Convert UV to texel space
            const x = u * (width - 1);
            const y = v * (height - 1);
            if (this.interpolation) {
                const x0 = Math.floor(x);
                const y0 = Math.floor(y);
                const x1 = Math.min(x0 + 1, width - 1);
                const y1 = Math.min(y0 + 1, height - 1);
                const dx = x - x0;
                const dy = y - y0;
                const c00 = this._getPixel(x0, y0, data, width);
                const c10 = this._getPixel(x1, y0, data, width);
                const c01 = this._getPixel(x0, y1, data, width);
                const c11 = this._getPixel(x1, y1, data, width);
                // Interpolate horizontally
                const top = this._lerp(c00, c10, dx);
                const bottom = this._lerp(c01, c11, dx);
                // Interpolate vertically
                return this._lerp(top, bottom, dy);
            }
            return this._getPixel(Math.floor(x), Math.floor(y), data, width);
        };
        this.rgba._storedFunction = (state) => {
            return func(state);
        };
        this.rgb._storedFunction = (state) => {
            const color = func(state);
            return color ? color.toVector3() : null;
        };
        this.r._storedFunction = (state) => {
            const color = func(state);
            return color ? color.x : null;
        };
        this.g._storedFunction = (state) => {
            const color = func(state);
            return color ? color.y : null;
        };
        this.b._storedFunction = (state) => {
            const color = func(state);
            return color ? color.z : null;
        };
        this.a._storedFunction = (state) => {
            const color = func(state);
            return color ? color.w : null;
        };
    }
    _dumpPropertiesCode() {
        const codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.clampCoordinates = ${this.clampCoordinates};\n`;
        return codeString;
    }
    /**
     * Serializes this block in a JSON representation
     * @returns the serialized block object
     */
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.clampCoordinates = this.clampCoordinates;
        serializationObject.interpolation = this.interpolation;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.clampCoordinates = serializationObject.clampCoordinates;
        if (serializationObject.clampCoordinates === undefined) {
            this.interpolation = serializationObject.interpolation;
        }
    }
}
__decorate([
    editableInPropertyPage("Clamp Coordinates", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })
], GeometryTextureFetchBlock.prototype, "clampCoordinates", void 0);
__decorate([
    editableInPropertyPage("Interpolation", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })
], GeometryTextureFetchBlock.prototype, "interpolation", void 0);
RegisterClass("BABYLON.GeometryTextureFetchBlock", GeometryTextureFetchBlock);
//# sourceMappingURL=geometryTextureFetchBlock.js.map