/**
 * Enum defining the type of properties that can be edited in the property pages in the node editor
 */
export var PropertyTypeForEdition;
(function (PropertyTypeForEdition) {
    /** property is a boolean */
    PropertyTypeForEdition[PropertyTypeForEdition["Boolean"] = 0] = "Boolean";
    /** property is a float */
    PropertyTypeForEdition[PropertyTypeForEdition["Float"] = 1] = "Float";
    /** property is a int */
    PropertyTypeForEdition[PropertyTypeForEdition["Int"] = 2] = "Int";
    /** property is a Vector2 */
    PropertyTypeForEdition[PropertyTypeForEdition["Vector2"] = 3] = "Vector2";
    /** property is a Vector3 */
    PropertyTypeForEdition[PropertyTypeForEdition["Vector3"] = 4] = "Vector3";
    /** property is a list of values */
    PropertyTypeForEdition[PropertyTypeForEdition["List"] = 5] = "List";
    /** property is a Color4 */
    PropertyTypeForEdition[PropertyTypeForEdition["Color4"] = 6] = "Color4";
    /** property (int) should be edited as a combo box with a list of sampling modes */
    PropertyTypeForEdition[PropertyTypeForEdition["SamplingMode"] = 7] = "SamplingMode";
    /** property (int) should be edited as a combo box with a list of texture formats */
    PropertyTypeForEdition[PropertyTypeForEdition["TextureFormat"] = 8] = "TextureFormat";
    /** property (int) should be edited as a combo box with a list of texture types */
    PropertyTypeForEdition[PropertyTypeForEdition["TextureType"] = 9] = "TextureType";
})(PropertyTypeForEdition || (PropertyTypeForEdition = {}));
/**
 * Decorator that flags a property in a node block as being editable
 * @param displayName the display name of the property
 * @param propertyType the type of the property
 * @param groupName the group name of the property
 * @param options the options of the property
 * @returns the decorator
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function editableInPropertyPage(displayName, propertyType = 0 /* PropertyTypeForEdition.Boolean */, groupName = "PROPERTIES", options) {
    return (target, propertyKey) => {
        let propStore = target._propStore;
        if (!propStore) {
            propStore = [];
            target._propStore = propStore;
        }
        propStore.push({
            propertyName: propertyKey,
            displayName: displayName,
            type: propertyType,
            groupName: groupName,
            options: options ?? {},
            className: target.getClassName(),
        });
    };
}
//# sourceMappingURL=nodeDecorator.js.map