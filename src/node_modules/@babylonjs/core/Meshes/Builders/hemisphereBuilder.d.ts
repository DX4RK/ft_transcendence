import { Mesh } from "../mesh.js";
import type { Scene } from "../../scene.js";
/**
 * Creates a hemisphere mesh
 * @param name defines the name of the mesh
 * @param options defines the options used to create the mesh
 * @param scene defines the hosting scene
 * @returns the hemisphere mesh
 */
export declare function CreateHemisphere(name: string, options?: {
    segments?: number;
    diameter?: number;
    sideOrientation?: number;
}, scene?: Scene): Mesh;
/**
 * Class containing static functions to help procedurally build meshes
 * @deprecated use the function directly from the module
 */
export declare const HemisphereBuilder: {
    CreateHemisphere: typeof CreateHemisphere;
};
