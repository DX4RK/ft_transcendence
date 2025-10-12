import { DecalMapConfiguration } from "../material.decalMapConfiguration.js";
import { PBRBaseMaterial } from "./pbrBaseMaterial.js";
Object.defineProperty(PBRBaseMaterial.prototype, "decalMap", {
    get: function () {
        if (!this._decalMap) {
            this._decalMap = new DecalMapConfiguration(this);
        }
        return this._decalMap;
    },
    enumerable: true,
    configurable: true,
});
//# sourceMappingURL=pbrMaterial.decalMap.js.map