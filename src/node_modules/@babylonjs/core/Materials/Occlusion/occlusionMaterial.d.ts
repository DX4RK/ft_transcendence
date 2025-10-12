import type { Scene } from "../../scene.js";
import { ShaderMaterial } from "../shaderMaterial.js";
import "../../Shaders/color.fragment.js";
import "../../Shaders/color.vertex.js";
/**
 * A material to use for fast depth-only rendering.
 * @since 5.0.0
 */
export declare class OcclusionMaterial extends ShaderMaterial {
    constructor(name: string, scene: Scene);
}
