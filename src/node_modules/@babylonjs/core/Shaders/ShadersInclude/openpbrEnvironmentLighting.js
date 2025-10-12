// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrEnvironmentLighting";
const shader = `#ifdef REFLECTION
vec3 baseDiffuseEnvironmentLight=sampleIrradiance(
normalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,viewDirectionW
,base_diffuse_roughness
,base_color
);
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=vec3(0.,0.,0.);
#else
vec2 reflectionCoords=vec2(0.,0.);
#endif
float specularAlphaG=specular_roughness*specular_roughness;
#ifdef ANISOTROPIC_BASE
vec3 baseSpecularEnvironmentLight=sampleRadianceAnisotropic(specularAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,normalW
,viewDirectionW
,vPositionW
,noise
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
reflectionCoords=createReflectionCoords(vPositionW,normalW);vec3 baseSpecularEnvironmentLight=sampleRadiance(specularAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
#ifdef ANISOTROPIC_BASE
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG*specularAlphaG*max(1.0-baseGeoInfo.anisotropy,0.3));
#else
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG);
#endif
vec3 coatEnvironmentLight=vec3(0.,0.,0.);if (coat_weight>0.0) {
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=vec3(0.,0.,0.);
#else
vec2 reflectionCoords=vec2(0.,0.);
#endif
reflectionCoords=createReflectionCoords(vPositionW,coatNormalW);float coatAlphaG=coat_roughness*coat_roughness;
#ifdef ANISOTROPIC_COAT
coatEnvironmentLight=sampleRadianceAnisotropic(coatAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,coatGeoInfo
,coatNormalW
,viewDirectionW
,vPositionW
,noise
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
coatEnvironmentLight=sampleRadiance(coatAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,coatGeoInfo
,reflectionSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
}
float dielectricIblFresnel=getReflectanceFromBRDFLookup(vec3(baseDielectricReflectance.F0),vec3(baseDielectricReflectance.F90),baseGeoInfo.environmentBrdf).r;vec3 dielectricIblColoredFresnel=getReflectanceFromBRDFLookup(baseDielectricReflectance.coloredF0,baseDielectricReflectance.coloredF90,baseGeoInfo.environmentBrdf);vec3 conductorIblFresnel=conductorIblFresnel(baseConductorReflectance,baseGeoInfo.NdotV,specular_roughness,baseGeoInfo.environmentBrdf);float coatIblFresnel=0.0;if (coat_weight>0.0) {coatIblFresnel=getReflectanceFromBRDFLookup(vec3(coatReflectance.F0),vec3(coatReflectance.F90),coatGeoInfo.environmentBrdf).r;}
vec3 slab_diffuse_ibl=vec3(0.,0.,0.);vec3 slab_glossy_ibl=vec3(0.,0.,0.);vec3 slab_metal_ibl=vec3(0.,0.,0.);vec3 slab_coat_ibl=vec3(0.,0.,0.);slab_diffuse_ibl=baseDiffuseEnvironmentLight*vLightingIntensity.z;slab_diffuse_ibl*=aoOut.ambientOcclusionColor;slab_glossy_ibl=baseSpecularEnvironmentLight*vLightingIntensity.z;slab_metal_ibl=baseSpecularEnvironmentLight*conductorIblFresnel*vLightingIntensity.z;vec3 coatAbsorption=vec3(1.0);if (coat_weight>0.0) {slab_coat_ibl=coatEnvironmentLight*vLightingIntensity.z;float hemisphere_avg_fresnel=coatReflectance.F0+0.5*(1.0-coatReflectance.F0);float averageReflectance=(coatIblFresnel+hemisphere_avg_fresnel)*0.5;float roughnessFactor=1.0-coat_roughness*0.5;averageReflectance*=roughnessFactor;float darkened_transmission=(1.0-averageReflectance)*(1.0-averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);float sin2=1.0-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior);float cos_t=sqrt(1.0-sin2);float coatPathLength=1.0/cos_t;vec3 colored_transmission=pow(coat_color,vec3(coatPathLength));coatAbsorption=mix(vec3(1.0),colored_transmission*darkened_transmission,coat_weight);}
vec3 slab_subsurface_ibl=vec3(0.,0.,0.);vec3 slab_translucent_base_ibl=vec3(0.,0.,0.);vec3 slab_fuzz_ibl=vec3(0.,0.,0.);slab_diffuse_ibl*=base_color.rgb;
#define CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION
vec3 material_opaque_base_ibl=mix(slab_diffuse_ibl,slab_subsurface_ibl,subsurface_weight);vec3 material_dielectric_base_ibl=mix(material_opaque_base_ibl,slab_translucent_base_ibl,transmission_weight);vec3 material_dielectric_gloss_ibl=layer(material_dielectric_base_ibl,slab_glossy_ibl,dielectricIblFresnel,vec3(1.0),specular_color);vec3 material_base_substrate_ibl=mix(material_dielectric_gloss_ibl,slab_metal_ibl,base_metalness);vec3 material_coated_base_ibl=layer(material_base_substrate_ibl,slab_coat_ibl,coatIblFresnel,coatAbsorption,vec3(1.0));material_surface_ibl=mix(material_coated_base_ibl,slab_fuzz_ibl,fuzz_weight);
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrEnvironmentLighting = { name, shader };
//# sourceMappingURL=openpbrEnvironmentLighting.js.map