// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "uvAttributeDeclaration";
const shader = `#ifdef UV{X}
attribute uv{X}: vec2f;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const uvAttributeDeclarationWGSL = { name, shader };
//# sourceMappingURL=uvAttributeDeclaration.js.map