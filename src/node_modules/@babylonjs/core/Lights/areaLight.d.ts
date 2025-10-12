import type { Vector3 } from "../Maths/math.vector.js";
import { Light } from "./light.js";
import type { Effect } from "../Materials/effect.js";
import type { ILTCTextures } from "./LTC/ltcTextureTool.js";
import type { Scene } from "../scene.js";
declare module "../scene.js" {
    interface Scene {
        /**
         * @internal
         */
        _ltcTextures?: ILTCTextures;
    }
}
/**
 * Abstract Area Light class that servers as parent for all Area Lights implementations.
 * The light is emitted from the area in the -Z direction.
 */
export declare abstract class AreaLight extends Light {
    /**
     * Area Light position.
     */
    position: Vector3;
    /**
     * Creates a area light object.
     * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
     * @param name The friendly name of the light
     * @param position The position of the area light.
     * @param scene The scene the light belongs to
     */
    constructor(name: string, position: Vector3, scene?: Scene);
    transferTexturesToEffect(effect: Effect): Light;
    /**
     * Prepares the list of defines specific to the light type.
     * @param defines the list of defines
     * @param lightIndex defines the index of the light for the effect
     */
    prepareLightSpecificDefines(defines: any, lightIndex: number): void;
    _isReady(): boolean;
}
