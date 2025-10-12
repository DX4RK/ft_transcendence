// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/prePassDeclaration.js";
import "./ShadersInclude/oitDeclaration.js";
import "./ShadersInclude/openpbrFragmentDeclaration.js";
import "./ShadersInclude/openpbrUboDeclaration.js";
import "./ShadersInclude/pbrFragmentExtraDeclaration.js";
import "./ShadersInclude/lightFragmentDeclaration.js";
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
#define CUSTOM_FRAGMENT_EXTENSION
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || !defined(NORMAL) || defined(FORCENORMALFORWARD) || defined(SPECULARAA)
#extension GL_OES_standard_derivatives : enable
#endif
#ifdef LODBASEDMICROSFURACE
#extension GL_EXT_shader_texture_lod : enable
#endif
#define CUSTOM_FRAGMENT_BEGIN
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<prePassDeclaration>[SCENE_MRT_COUNT]
precision highp float;
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<__decl__openpbrFragment>
#include<pbrFragmentExtraDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
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
vec3 layer(vec3 slab_bottom,vec3 slab_top,float lerp_factor,vec3 bottom_multiplier,vec3 top_multiplier) {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
vec3 coatNormalW=normalW;
#include<openpbrNormalMapFragment>
#include<openpbrBlockNormalFinal>
#include<openpbrBaseLayerData>
#include<openpbrCoatLayerData>
float subsurface_weight=0.0;float transmission_weight=0.0;float fuzz_weight=0.0;
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
ambientOcclusionOutParams aoOut;
#ifdef AMBIENT_OCCLUSION
vec3 ambientOcclusionFromTexture=texture2D(ambientOcclusionSampler,vAmbientOcclusionUV+uvOffset).rgb;
#endif
aoOut=ambientOcclusionBlock(
#ifdef AMBIENT_OCCLUSION
ambientOcclusionFromTexture,
vAmbientOcclusionInfos
#endif
);
#ifdef ANISOTROPIC_COAT
geometryInfoAnisoOutParams coatGeoInfo=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
geometryInfoOutParams coatGeoInfo=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0,pow(specular_roughness,4.0)+2.0*pow(coat_roughness,4.0)),0.25),coat_weight);
#ifdef ANISOTROPIC_BASE
geometryInfoAnisoOutParams baseGeoInfo=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
geometryInfoOutParams baseGeoInfo=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
ReflectanceParams coatReflectance;coatReflectance=dielectricReflectance(
coat_ior 
,1.0 
,vec3(1.0)
,coat_weight
);ReflectanceParams baseDielectricReflectance;{float effectiveCoatIor=mix(1.0,coat_ior,coat_weight);baseDielectricReflectance=dielectricReflectance(
specular_ior 
,effectiveCoatIor 
,specular_color
,specular_weight
);}
ReflectanceParams baseConductorReflectance;baseConductorReflectance=conductorReflectance(base_color,specular_color,specular_weight);vec3 material_surface_ibl=vec3(0.,0.,0.);
#include<openpbrEnvironmentLighting>
vec3 material_surface_direct=vec3(0.,0.,0.);
#if defined(LIGHT0)
float aggShadow=0.;float numLights=0.;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
vec3 material_surface_emission=vEmissionColor;
#ifdef EMISSION_COLOR
vec3 emissionColorTex=texture2D(emissionColorSampler,vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpace(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= vEmissionColorInfos.y;
#endif
material_surface_emission*=vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
vec4 finalColor=vec4(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,0.0);
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<pbrBlockPrePass>
#endif
#if !defined(PREPASS) || defined(WEBGL2)
gl_FragColor=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {frontColor.rgb+=finalColor.rgb*finalColor.a*alphaMultiplier;frontColor.a=1.0-alphaMultiplier*(1.0-finalColor.a);} else {backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
/** @internal */
export const openpbrPixelShader = { name, shader };
//# sourceMappingURL=openpbr.fragment.js.map