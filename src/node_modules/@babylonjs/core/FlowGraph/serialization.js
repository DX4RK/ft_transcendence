import { Color3, Color4 } from "../Maths/math.color.js";
import { Matrix, Quaternion, Vector2, Vector3, Vector4 } from "../Maths/math.vector.js";
import { FlowGraphInteger } from "./CustomTypes/flowGraphInteger.js";
import { getRichTypeByFlowGraphType } from "./flowGraphRichTypes.js";
import { FlowGraphMatrix2D, FlowGraphMatrix3D } from "./CustomTypes/flowGraphMatrix.js";
function IsMeshClassName(className) {
    return (className === "Mesh" ||
        className === "AbstractMesh" ||
        className === "GroundMesh" ||
        className === "InstanceMesh" ||
        className === "LinesMesh" ||
        className === "GoldbergMesh" ||
        className === "GreasedLineMesh" ||
        className === "TrailMesh");
}
function IsVectorClassName(className) {
    return (className === "Vector2" /* FlowGraphTypes.Vector2 */ ||
        className === "Vector3" /* FlowGraphTypes.Vector3 */ ||
        className === "Vector4" /* FlowGraphTypes.Vector4 */ ||
        className === "Quaternion" /* FlowGraphTypes.Quaternion */ ||
        className === "Color3" /* FlowGraphTypes.Color3 */ ||
        className === "Color4" /* FlowGraphTypes.Color4 */);
}
function IsMatrixClassName(className) {
    return className === "Matrix" /* FlowGraphTypes.Matrix */ || className === "Matrix2D" /* FlowGraphTypes.Matrix2D */ || className === "Matrix3D" /* FlowGraphTypes.Matrix3D */;
}
function IsAnimationGroupClassName(className) {
    return className === "AnimationGroup";
}
function ParseVector(className, value, flipHandedness = false) {
    if (className === "Vector2" /* FlowGraphTypes.Vector2 */) {
        return Vector2.FromArray(value);
    }
    else if (className === "Vector3" /* FlowGraphTypes.Vector3 */) {
        if (flipHandedness) {
            value[2] *= -1;
        }
        return Vector3.FromArray(value);
    }
    else if (className === "Vector4" /* FlowGraphTypes.Vector4 */) {
        return Vector4.FromArray(value);
    }
    else if (className === "Quaternion" /* FlowGraphTypes.Quaternion */) {
        if (flipHandedness) {
            value[2] *= -1;
            value[3] *= -1;
        }
        return Quaternion.FromArray(value);
    }
    else if (className === "Color3" /* FlowGraphTypes.Color3 */) {
        return new Color3(value[0], value[1], value[2]);
    }
    else if (className === "Color4" /* FlowGraphTypes.Color4 */) {
        return new Color4(value[0], value[1], value[2], value[3]);
    }
    else {
        throw new Error(`Unknown vector class name ${className}`);
    }
}
/**
 * The default function that serializes values in a context object to a serialization object
 * @param key the key where the value should be stored in the serialization object
 * @param value the value to store
 * @param serializationObject the object where the value will be stored
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function defaultValueSerializationFunction(key, value, serializationObject) {
    const className = value?.getClassName?.() ?? "";
    if (IsVectorClassName(className) || IsMatrixClassName(className)) {
        serializationObject[key] = {
            value: value.asArray(),
            className,
        };
    }
    else if (className === "FlowGraphInteger" /* FlowGraphTypes.Integer */) {
        serializationObject[key] = {
            value: value.value,
            className,
        };
    }
    else {
        if (className && (value.id || value.name)) {
            serializationObject[key] = {
                id: value.id,
                name: value.name,
                className,
            };
        }
        else {
            // only if it is not an object
            if (typeof value !== "object") {
                serializationObject[key] = value;
            }
            else {
                throw new Error(`Could not serialize value ${value}`);
            }
        }
    }
}
/**
 * The default function that parses values stored in a serialization object
 * @param key the key to the value that will be parsed
 * @param serializationObject the object that will be parsed
 * @param assetsContainer the assets container that will be used to find the objects
 * @param scene
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function defaultValueParseFunction(key, serializationObject, assetsContainer, scene) {
    const intermediateValue = serializationObject[key];
    let finalValue;
    const className = intermediateValue?.type ?? intermediateValue?.className;
    if (IsMeshClassName(className)) {
        let nodes = scene.meshes.filter((m) => (intermediateValue.id ? m.id === intermediateValue.id : m.name === intermediateValue.name));
        if (nodes.length === 0) {
            nodes = scene.transformNodes.filter((m) => (intermediateValue.id ? m.id === intermediateValue.id : m.name === intermediateValue.name));
        }
        finalValue = intermediateValue.uniqueId ? nodes.find((m) => m.uniqueId === intermediateValue.uniqueId) : nodes[0];
    }
    else if (IsVectorClassName(className)) {
        finalValue = ParseVector(className, intermediateValue.value);
    }
    else if (IsAnimationGroupClassName(className)) {
        // do not use the scene.getAnimationGroupByName because it is possible that two AGs will have the same name
        const ags = scene.animationGroups.filter((ag) => ag.name === intermediateValue.name);
        // uniqueId changes on each load. this is used for the glTF loader, that uses serialization after the scene was loaded.
        finalValue = ags.length === 1 ? ags[0] : ags.find((ag) => ag.uniqueId === intermediateValue.uniqueId);
    }
    else if (className === "Matrix" /* FlowGraphTypes.Matrix */) {
        finalValue = Matrix.FromArray(intermediateValue.value);
    }
    else if (className === "Matrix2D" /* FlowGraphTypes.Matrix2D */) {
        finalValue = new FlowGraphMatrix2D(intermediateValue.value);
    }
    else if (className === "Matrix3D" /* FlowGraphTypes.Matrix3D */) {
        finalValue = new FlowGraphMatrix3D(intermediateValue.value);
    }
    else if (className === "FlowGraphInteger" /* FlowGraphTypes.Integer */) {
        finalValue = FlowGraphInteger.FromValue(intermediateValue.value);
    }
    else if (className === "number" /* FlowGraphTypes.Number */ || className === "string" /* FlowGraphTypes.String */ || className === "boolean" /* FlowGraphTypes.Boolean */) {
        finalValue = intermediateValue.value[0];
    }
    else if (intermediateValue && intermediateValue.value !== undefined) {
        finalValue = intermediateValue.value;
    }
    else {
        if (Array.isArray(intermediateValue)) {
            // configuration data of an event
            finalValue = intermediateValue.reduce((acc, val) => {
                if (!val.eventData) {
                    return acc;
                }
                acc[val.id] = {
                    type: getRichTypeByFlowGraphType(val.type),
                };
                if (typeof val.value !== "undefined") {
                    acc[val.id].value = defaultValueParseFunction("value", val, assetsContainer, scene);
                }
                return acc;
            }, {});
        }
        else {
            finalValue = intermediateValue;
        }
    }
    return finalValue;
}
/**
 * Given a name of a flow graph block class, return if this
 * class needs to be created with a path converter. Used in
 * parsing.
 * @param className the name of the flow graph block class
 * @returns a boolean indicating if the class needs a path converter
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function needsPathConverter(className) {
    // I am not using the ClassName property here because it was causing a circular dependency
    // that jest didn't like!
    return className === "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */;
}
//# sourceMappingURL=serialization.js.map