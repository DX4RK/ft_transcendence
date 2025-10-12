// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "openpbrDirectLighting";
const shader = `#ifdef LIGHT{X}
{vec3 slab_diffuse=vec3(0.,0.,0.);vec3 slab_subsurface=vec3(0.,0.,0.);vec3 slab_translucent=vec3(0.,0.,0.);vec3 slab_glossy=vec3(0.,0.,0.);float specularFresnel=0.0;vec3 slab_metal=vec3(0.,0.,0.);vec3 slab_coat=vec3(0.,0.,0.);float coatFresnel=0.0;vec3 slab_fuzz=vec3(0.,0.,0.);
#ifdef HEMILIGHT{X}
slab_diffuse=computeHemisphericDiffuseLighting(preInfo{X},lightColor{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X})
slab_diffuse=computeAreaDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#else
slab_diffuse=computeDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
slab_diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},textureProjectionMatrix{X},vPositionW);
#endif
numLights+=1.0;
#if AREALIGHT{X}
slab_glossy=computeAreaSpecularLighting(preInfo{X},light{X}.vLightSpecular.rgb,baseConductorReflectance.F0,baseConductorReflectance.F90);
#else
{
#ifdef ANISOTROPIC_BASE
slab_glossy=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
0.0,lightColor{X}.rgb);
#else
slab_glossy=computeSpecularLighting(preInfo{X},normalW,baseDielectricReflectance.coloredF0,baseDielectricReflectance.coloredF90,specular_roughness,lightColor{X}.rgb);
#endif
float NdotH=dot(normalW,preInfo{X}.H);specularFresnel=fresnelSchlickGGX(NdotH,baseDielectricReflectance.F0,baseDielectricReflectance.F90);}
#endif
#if AREALIGHT{X}
slab_metal=computeAreaSpecularLighting(preInfo{X},light{X}.vLightSpecular.rgb,baseConductorReflectance.F0,baseConductorReflectance.F90);
#else
{
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
vec3 coloredFresnel=specular_weight*getF82Specular(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90,specular_roughness);
#else
vec3 coloredFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);
#endif
#ifdef ANISOTROPIC_BASE
slab_metal=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,0.0,lightColor{X}.rgb);
#else
slab_metal=computeSpecularLighting(preInfo{X},normalW,baseConductorReflectance.coloredF0,coloredFresnel,specular_roughness,lightColor{X}.rgb);
#endif
}
#endif
#if AREALIGHT{X}
slab_coat=computeAreaSpecularLighting(preInfoCoat{X},light{X}.vLightSpecular.rgb,coatReflectance.F0,coatReflectance.F90);
#else
{
#ifdef ANISOTROPIC_COAT
slab_coat=computeAnisotropicSpecularLighting(preInfoCoat{X},viewDirectionW,coatNormalW,
coatGeoInfo.anisotropicTangent,coatGeoInfo.anisotropicBitangent,coatGeoInfo.anisotropy,
0.0,lightColor{X}.rgb);
#else
slab_coat=computeSpecularLighting(preInfoCoat{X},coatNormalW,vec3(coatReflectance.F0),vec3(1.0),coat_roughness,lightColor{X}.rgb);
#endif
float NdotH=dot(coatNormalW,preInfoCoat{X}.H);coatFresnel=fresnelSchlickGGX(NdotH,coatReflectance.F0,coatReflectance.F90);}
#endif
vec3 coatAbsorption=vec3(1.0);if (coat_weight>0.0) {float cosTheta_view=max(preInfoCoat{X}.NdotV,0.001);float cosTheta_light=max(preInfoCoat{X}.NdotL,0.001);float fresnel_view=coatReflectance.F0+(1.0-coatReflectance.F0)*pow(1.0-cosTheta_view,5.0);float fresnel_light=coatReflectance.F0+(1.0-coatReflectance.F0)*pow(1.0-cosTheta_light,5.0);float averageReflectance=(fresnel_view+fresnel_light)*0.5;float darkened_transmission=(1.0-averageReflectance)/(1.0+averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);float sin2=1.0-cosTheta_view*cosTheta_view;sin2=sin2/(coat_ior*coat_ior);float cos_t=sqrt(1.0-sin2);float coatPathLength=1.0/cos_t;vec3 colored_transmission=pow(coat_color,vec3(coatPathLength));coatAbsorption=mix(vec3(1.0),colored_transmission*darkened_transmission,coat_weight);}
slab_diffuse*=base_color.rgb;vec3 material_opaque_base=mix(slab_diffuse,slab_subsurface,subsurface_weight);vec3 material_dielectric_base=mix(material_opaque_base,slab_translucent,transmission_weight);vec3 material_dielectric_gloss=layer(material_dielectric_base,slab_glossy,specularFresnel,vec3(1.0),specular_color);vec3 material_base_substrate=mix(material_dielectric_gloss,slab_metal,base_metalness);vec3 material_coated_base=layer(material_base_substrate,slab_coat,coatFresnel,coatAbsorption,vec3(1.0));material_surface_direct+=mix(material_coated_base,slab_fuzz,fuzz_weight);}
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const openpbrDirectLighting = { name, shader };
//# sourceMappingURL=openpbrDirectLighting.js.map