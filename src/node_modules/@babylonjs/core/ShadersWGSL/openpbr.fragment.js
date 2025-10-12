// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/prePassDeclaration.js";
import "./ShadersInclude/oitDeclaration.js";
import "./ShadersInclude/openpbrUboDeclaration.js";
import "./ShadersInclude/pbrFragmentExtraDeclaration.js";
import "./ShadersInclude/lightUboDeclaration.js";
import "./ShadersInclude/openpbrFragmentSamplersDeclaration.js";
import "./ShadersInclude/imageProcessingDeclaration.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/logDepthDeclaration.js";
import "./ShadersInclude/fogFragmentDeclaration.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/subSurfaceScatteringFunctions.js";
import "./ShadersInclude/importanceSampling.js";
import "./ShadersInclude/pbrHelperFunctions.js";
import "./ShadersInclude/imageProcessingFunctions.js";
import "./ShadersInclude/shadowsFragmentFunctions.js";
import "./ShadersInclude/harmonicsFunctions.js";
import "./ShadersInclude/pbrDirectLightingSetupFunctions.js";
import "./ShadersInclude/pbrDirectLightingFalloffFunctions.js";
import "./ShadersInclude/pbrBRDFFunctions.js";
import "./ShadersInclude/hdrFilteringFunctions.js";
import "./ShadersInclude/pbrDirectLightingFunctions.js";
import "./ShadersInclude/pbrIBLFunctions.js";
import "./ShadersInclude/openpbrNormalMapFragmentMainFunctions.js";
import "./ShadersInclude/openpbrNormalMapFragmentFunctions.js";
import "./ShadersInclude/reflectionFunction.js";
import "./ShadersInclude/openpbrDielectricReflectance.js";
import "./ShadersInclude/openpbrConductorReflectance.js";
import "./ShadersInclude/openpbrBlockAmbientOcclusion.js";
import "./ShadersInclude/openpbrGeometryInfo.js";
import "./ShadersInclude/openpbrIblFunctions.js";
import "./ShadersInclude/clipPlaneFragment.js";
import "./ShadersInclude/pbrBlockNormalGeometric.js";
import "./ShadersInclude/openpbrNormalMapFragment.js";
import "./ShadersInclude/openpbrBlockNormalFinal.js";
import "./ShadersInclude/openpbrBaseLayerData.js";
import "./ShadersInclude/openpbrCoatLayerData.js";
import "./ShadersInclude/depthPrePass.js";
import "./ShadersInclude/openpbrEnvironmentLighting.js";
import "./ShadersInclude/openpbrDirectLightingInit.js";
import "./ShadersInclude/openpbrDirectLighting.js";
import "./ShadersInclude/logDepthFragment.js";
import "./ShadersInclude/fogFragment.js";
import "./ShadersInclude/pbrBlockImageProcessing.js";
import "./ShadersInclude/pbrBlockPrePass.js";
import "./ShadersInclude/oitFragment.js";
import "./ShadersInclude/pbrDebug.js";
const name = "openpbrPixelShader";
const shader = `#define OPENPBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<openpbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<openpbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<importanceSampling>
#include<pbrHelperFunctions>
#include<imageProcessingFunctions>
#include<shadowsFragmentFunctions>
#include<harmonicsFunctions>
#include<pbrDirectLightingSetupFunctions>
#include<pbrDirectLightingFalloffFunctions>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
#include<pbrDirectLightingFunctions>
#include<pbrIBLFunctions>
#include<openpbrNormalMapFragmentMainFunctions>
#include<openpbrNormalMapFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<openpbrDielectricReflectance>
#include<openpbrConductorReflectance>
#include<openpbrBlockAmbientOcclusion>
#include<openpbrGeometryInfo>
#include<openpbrIblFunctions>
fn layer(slab_bottom: vec3f,slab_top: vec3f,lerp_factor: f32,bottom_multiplier: vec3f,top_multiplier: vec3f)->vec3f {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
var coatNormalW: vec3f=normalW;
#include<openpbrNormalMapFragment>
#include<openpbrBlockNormalFinal>
#include<openpbrBaseLayerData>
#include<openpbrCoatLayerData>
var subsurface_weight: f32=0.0f;var transmission_weight: f32=0.0f;var fuzz_weight: f32=0.0f;
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
var aoOut: ambientOcclusionOutParams;
#ifdef AMBIENT_OCCLUSION
var ambientOcclusionFromTexture: vec3f=textureSample(ambientOcclusionSampler,ambientOcclusionSamplerSampler,fragmentInputs.vAmbientOcclusionUV+uvOffset).rgb;
#endif
aoOut=ambientOcclusionBlock(
#ifdef AMBIENT_OCCLUSION
ambientOcclusionFromTexture,
uniforms.vAmbientOcclusionInfos
#endif
);
#ifdef ANISOTROPIC_COAT
let coatGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3f(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
let coatGeoInfo: geometryInfoOutParams=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0f,pow(specular_roughness,4.0f)+2.0f*pow(coat_roughness,4.0f)),0.25f),coat_weight);
#ifdef ANISOTROPIC_BASE
let baseGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3f(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
let baseGeoInfo: geometryInfoOutParams=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
let coatReflectance: ReflectanceParams=dielectricReflectance(
coat_ior 
,1.0f 
,vec3f(1.0f)
,coat_weight
);let baseDielectricReflectance: ReflectanceParams=dielectricReflectance(
specular_ior 
,mix(1.0f,coat_ior,coat_weight) 
,specular_color
,specular_weight
);let baseConductorReflectance: ReflectanceParams=conductorReflectance(base_color,specular_color,specular_weight);var material_surface_ibl: vec3f=vec3f(0.f,0.f,0.f);
#include<openpbrEnvironmentLighting>
var material_surface_direct: vec3f=vec3f(0.f,0.f,0.f);
#if defined(LIGHT0)
var aggShadow: f32=0.f;var numLights: f32=0.f;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
var material_surface_emission: vec3f=uniforms.vEmissionColor;
#ifdef EMISSION_COLOR
let emissionColorTex: vec3f=textureSample(emissionColorSampler,emissionColorSamplerSampler,uniforms.vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpace(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= uniforms.vEmissionColorInfos.y;
#endif
material_surface_emission*=uniforms.vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
var finalColor: vec4f=vec4f(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,vec4f(0.0));
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<pbrBlockPrePass>
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+finalColor.rgb*finalColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-finalColor.a));} else {fragmentOutputs.backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
/** @internal */
export const openpbrPixelShaderWGSL = { name, shader };
//# sourceMappingURL=openpbr.fragment.js.map