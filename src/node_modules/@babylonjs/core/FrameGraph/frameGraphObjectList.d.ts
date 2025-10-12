import type { Nullable, AbstractMesh, IParticleSystem } from "../index.js";
/**
 * Structure used by the frame graph to reference objects.
 * @experimental
 */
export declare class FrameGraphObjectList {
    /**
     * The meshes in the object list.
     */
    meshes: Nullable<AbstractMesh[]>;
    /**
     * The particle systems in the object list.
     */
    particleSystems: Nullable<IParticleSystem[]>;
}
