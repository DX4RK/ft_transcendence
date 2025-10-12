const MergedStore = {};
const DecoratorInitialStore = {};
/** @internal */
export function GetDirectStore(target) {
    const classKey = target.getClassName();
    if (!DecoratorInitialStore[classKey]) {
        DecoratorInitialStore[classKey] = {};
    }
    return DecoratorInitialStore[classKey];
}
/**
 * @returns the list of properties flagged as serializable
 * @param target host object
 */
export function GetMergedStore(target) {
    const classKey = target.getClassName();
    if (MergedStore[classKey]) {
        return MergedStore[classKey];
    }
    MergedStore[classKey] = {};
    const store = MergedStore[classKey];
    let currentTarget = target;
    let currentKey = classKey;
    while (currentKey) {
        const initialStore = DecoratorInitialStore[currentKey];
        for (const property in initialStore) {
            store[property] = initialStore[property];
        }
        let parent;
        let done = false;
        do {
            parent = Object.getPrototypeOf(currentTarget);
            if (!parent.getClassName) {
                done = true;
                break;
            }
            if (parent.getClassName() !== currentKey) {
                break;
            }
            currentTarget = parent;
        } while (parent);
        if (done) {
            break;
        }
        currentKey = parent.getClassName();
        currentTarget = parent;
    }
    return store;
}
//# sourceMappingURL=decorators.functions.js.map