// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "gaussianSplattingVertexDeclaration";
const shader = `attribute position: vec2f;
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const gaussianSplattingVertexDeclarationWGSL = { name, shader };
//# sourceMappingURL=gaussianSplattingVertexDeclaration.js.map