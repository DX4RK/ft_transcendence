import type { SubMesh } from "../../Meshes/subMesh.js";
import type { AbstractMesh } from "../../Meshes/abstractMesh.js";
import type { Mesh } from "../../Meshes/mesh.js";
import type { Effect } from "../../Materials/effect.js";
import type { Scene } from "../../scene.js";
import type { Matrix } from "../../Maths/math.vector.js";
import { PushMaterial } from "../../Materials/pushMaterial.js";
import "../../Shaders/gaussianSplatting.fragment.js";
import "../../Shaders/gaussianSplatting.vertex.js";
import "../../ShadersWGSL/gaussianSplatting.fragment.js";
import "../../ShadersWGSL/gaussianSplatting.vertex.js";
/**
 * GaussianSplattingMaterial material used to render Gaussian Splatting
 * @experimental
 */
export declare class GaussianSplattingMaterial extends PushMaterial {
    /**
     * Instantiates a Gaussian Splatting Material in the given scene
     * @param name The friendly name of the material
     * @param scene The scene to add the material to
     */
    constructor(name: string, scene?: Scene);
    /**
     * Point spread function (default 0.3). Can be overriden per GS material
     */
    static KernelSize: number;
    /**
     * Compensation
     */
    static Compensation: boolean;
    /**
     * Point spread function (default 0.3). Can be overriden per GS material, otherwise, using default static `KernelSize` value
     */
    kernelSize: number;
    private _compensation;
    private _isDirty;
    /**
     * Set compensation default value is `GaussianSplattingMaterial.Compensation`
     */
    set compensation(value: boolean);
    /**
     * Get compensation
     */
    get compensation(): boolean;
    /**
     * Gets a boolean indicating that current material needs to register RTT
     */
    get hasRenderTargetTextures(): boolean;
    /**
     * Specifies whether or not this material should be rendered in alpha test mode.
     * @returns false
     */
    needAlphaTesting(): boolean;
    /**
     * Specifies whether or not this material should be rendered in alpha blend mode.
     * @returns true
     */
    needAlphaBlending(): boolean;
    /**
     * Checks whether the material is ready to be rendered for a given mesh.
     * @param mesh The mesh to render
     * @param subMesh The submesh to check against
     * @returns true if all the dependencies are ready (Textures, Effects...)
     */
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh): boolean;
    /**
     * Bind material effect for a specific Gaussian Splatting mesh
     * @param mesh Gaussian splatting mesh
     * @param effect Splatting material or node material
     * @param scene scene that contains mesh and camera used for rendering
     */
    static BindEffect(mesh: Mesh, effect: Effect, scene: Scene): void;
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    /**
     * Clones the material.
     * @param name The cloned name.
     * @returns The cloned material.
     */
    clone(name: string): GaussianSplattingMaterial;
    /**
     * Serializes the current material to its JSON representation.
     * @returns The JSON representation.
     */
    serialize(): any;
    /**
     * Gets the class name of the material
     * @returns "GaussianSplattingMaterial"
     */
    getClassName(): string;
    /**
     * Parse a JSON input to create back a Gaussian Splatting material.
     * @param source The JSON data to parse
     * @param scene The scene to create the parsed material in
     * @param rootUrl The root url of the assets the material depends upon
     * @returns the instantiated GaussianSplattingMaterial.
     */
    static Parse(source: any, scene: Scene, rootUrl: string): GaussianSplattingMaterial;
}
