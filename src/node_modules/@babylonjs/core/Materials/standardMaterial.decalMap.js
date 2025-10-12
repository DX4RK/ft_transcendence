import { DecalMapConfiguration } from "./material.decalMapConfiguration.js";
import { StandardMaterial } from "./standardMaterial.js";
Object.defineProperty(StandardMaterial.prototype, "decalMap", {
    get: function () {
        if (!this._decalMap) {
            this._decalMap = new DecalMapConfiguration(this);
        }
        return this._decalMap;
    },
    enumerable: true,
    configurable: true,
});
//# sourceMappingURL=standardMaterial.decalMap.js.map