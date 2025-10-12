// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrDielectricReflectance";
const shader = `struct ReflectanceParams
{F0: f32,
F90: f32,
coloredF0: vec3f,
coloredF90: vec3f,};
#define pbr_inline
fn dielectricReflectance(
insideIOR: f32,outsideIOR: f32,specularColor: vec3f,specularWeight: f32
)->ReflectanceParams
{var outParams: ReflectanceParams;let dielectricF0=pow((insideIOR-outsideIOR)/(insideIOR+outsideIOR),2.0);
#if DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_GLTF
let maxF0=max(specularColor.r,max(specularColor.g,specularColor.b));outParams.F0=dielectricF0*maxF0*specularWeight;
#else
outParams.F0=dielectricF0*specularWeight;
#endif
let f90Scale=clamp(2.0f*abs(insideIOR-outsideIOR),0.0f,1.0f);outParams.F90=f90Scale*specularWeight;outParams.coloredF0=vec3f(dielectricF0*specularWeight)*specularColor.rgb;
#if (DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_OPENPBR)
let dielectricColorF90: vec3f=specularColor.rgb*vec3f(f90Scale)*specularWeight;
#else
let dielectricColorF90: vec3f=vec3f(f90Scale)*specularWeight;
#endif
outParams.coloredF90=dielectricColorF90;return outParams;}
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrDielectricReflectanceWGSL = { name, shader };
//# sourceMappingURL=openpbrDielectricReflectance.js.map