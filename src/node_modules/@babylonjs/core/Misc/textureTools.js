import { Texture } from "../Materials/Textures/texture.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.js";
import { PassPostProcess } from "../PostProcesses/passPostProcess.js";

import { PostProcess } from "../PostProcesses/postProcess.js";
import { Clamp } from "../Maths/math.scalar.functions.js";
/**
 * Uses the GPU to create a copy texture rescaled at a given size
 * @param texture Texture to copy from
 * @param width defines the desired width
 * @param height defines the desired height
 * @param useBilinearMode defines if bilinear mode has to be used
 * @returns the generated texture
 */
export function CreateResizedCopy(texture, width, height, useBilinearMode = true) {
    const scene = texture.getScene();
    const engine = scene.getEngine();
    const rtt = new RenderTargetTexture("resized" + texture.name, { width: width, height: height }, scene, !texture.noMipmap, true, texture._texture.type, false, texture.samplingMode, false);
    rtt.wrapU = texture.wrapU;
    rtt.wrapV = texture.wrapV;
    rtt.uOffset = texture.uOffset;
    rtt.vOffset = texture.vOffset;
    rtt.uScale = texture.uScale;
    rtt.vScale = texture.vScale;
    rtt.uAng = texture.uAng;
    rtt.vAng = texture.vAng;
    rtt.wAng = texture.wAng;
    rtt.coordinatesIndex = texture.coordinatesIndex;
    rtt.level = texture.level;
    rtt.anisotropicFilteringLevel = texture.anisotropicFilteringLevel;
    rtt._texture.isReady = false;
    texture.wrapU = Texture.CLAMP_ADDRESSMODE;
    texture.wrapV = Texture.CLAMP_ADDRESSMODE;
    const passPostProcess = new PassPostProcess("pass", 1, null, useBilinearMode ? Texture.BILINEAR_SAMPLINGMODE : Texture.NEAREST_SAMPLINGMODE, engine, false, 0);
    passPostProcess.externalTextureSamplerBinding = true;
    passPostProcess.onEffectCreatedObservable.addOnce((e) => {
        e.executeWhenCompiled(() => {
            passPostProcess.onApply = function (effect) {
                effect.setTexture("textureSampler", texture);
            };
            const internalTexture = rtt.renderTarget;
            if (internalTexture) {
                scene.postProcessManager.directRender([passPostProcess], internalTexture);
                engine.unBindFramebuffer(internalTexture);
                rtt.disposeFramebufferObjects();
                passPostProcess.dispose();
                rtt.getInternalTexture().isReady = true;
            }
        });
    });
    return rtt;
}
/**
 * Apply a post process to a texture
 * @param postProcessName name of the fragment post process
 * @param internalTexture the texture to encode
 * @param scene the scene hosting the texture
 * @param type type of the output texture. If not provided, use the one from internalTexture
 * @param samplingMode sampling mode to use to sample the source texture. If not provided, use the one from internalTexture
 * @param format format of the output texture. If not provided, use the one from internalTexture
 * @param width width of the output texture. If not provided, use the one from internalTexture
 * @param height height of the output texture. If not provided, use the one from internalTexture
 * @returns a promise with the internalTexture having its texture replaced by the result of the processing
 */
// eslint-disable-next-line @typescript-eslint/promise-function-async
export function ApplyPostProcess(postProcessName, internalTexture, scene, type, samplingMode, format, width, height) {
    // Gets everything ready.
    const engine = internalTexture.getEngine();
    internalTexture.isReady = false;
    samplingMode = samplingMode ?? internalTexture.samplingMode;
    type = type ?? internalTexture.type;
    format = format ?? internalTexture.format;
    width = width ?? internalTexture.width;
    height = height ?? internalTexture.height;
    if (type === -1) {
        type = 0;
    }
    return new Promise((resolve) => {
        // Create the post process
        const postProcess = new PostProcess("postprocess", postProcessName, null, null, 1, null, samplingMode, engine, false, undefined, type, undefined, null, false, format);
        postProcess.externalTextureSamplerBinding = true;
        // Hold the output of the decoding.
        const encodedTexture = engine.createRenderTargetTexture({ width: width, height: height }, {
            generateDepthBuffer: false,
            generateMipMaps: false,
            generateStencilBuffer: false,
            samplingMode,
            type,
            format,
        });
        postProcess.onEffectCreatedObservable.addOnce((e) => {
            e.executeWhenCompiled(() => {
                // PP Render Pass
                postProcess.onApply = (effect) => {
                    effect._bindTexture("textureSampler", internalTexture);
                    effect.setFloat2("scale", 1, 1);
                };
                scene.postProcessManager.directRender([postProcess], encodedTexture, true);
                // Cleanup
                engine.restoreDefaultFramebuffer();
                engine._releaseTexture(internalTexture);
                if (postProcess) {
                    postProcess.dispose();
                }
                // Internal Swap
                encodedTexture._swapAndDie(internalTexture);
                // Ready to get rolling again.
                internalTexture.type = type;
                internalTexture.format = 5;
                internalTexture.isReady = true;
                resolve(internalTexture);
            });
        });
    });
}
// ref: http://stackoverflow.com/questions/32633585/how-do-you-convert-to-half-floats-in-javascript
let floatView;
let int32View;
/**
 * Converts a number to half float
 * @param value number to convert
 * @returns converted number
 */
export function ToHalfFloat(value) {
    if (!floatView) {
        floatView = new Float32Array(1);
        int32View = new Int32Array(floatView.buffer);
    }
    floatView[0] = value;
    const x = int32View[0];
    let bits = (x >> 16) & 0x8000; /* Get the sign */
    let m = (x >> 12) & 0x07ff; /* Keep one extra bit for rounding */
    const e = (x >> 23) & 0xff; /* Using int is faster here */
    /* If zero, or denormal, or exponent underflows too much for a denormal
     * half, return signed zero. */
    if (e < 103) {
        return bits;
    }
    /* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
    if (e > 142) {
        bits |= 0x7c00;
        /* If exponent was 0xff and one mantissa bit was set, it means NaN,
         * not Inf, so make sure we set one mantissa bit too. */
        bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
        return bits;
    }
    /* If exponent underflows but not too much, return a denormal */
    if (e < 113) {
        m |= 0x0800;
        /* Extra rounding may overflow and set mantissa to 0 and exponent
         * to 1, which is OK. */
        bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
        return bits;
    }
    bits |= ((e - 112) << 10) | (m >> 1);
    bits += m & 1;
    return bits;
}
/**
 * Converts a half float to a number
 * @param value half float to convert
 * @returns converted half float
 */
export function FromHalfFloat(value) {
    const s = (value & 0x8000) >> 15;
    const e = (value & 0x7c00) >> 10;
    const f = value & 0x03ff;
    if (e === 0) {
        return (s ? -1 : 1) * Math.pow(2, -14) * (f / Math.pow(2, 10));
    }
    else if (e == 0x1f) {
        return f ? NaN : (s ? -1 : 1) * Infinity;
    }
    return (s ? -1 : 1) * Math.pow(2, e - 15) * (1 + f / Math.pow(2, 10));
}
function IsCompressedTextureFormat(format) {
    switch (format) {
        case 36492:
        case 36493:
        case 36495:
        case 36494:
        case 33779:
        case 35919:
        case 33778:
        case 35918:
        case 33777:
        case 33776:
        case 35917:
        case 35916:
        case 37808:
        case 37840:
        case 36196:
        case 37492:
        case 37493:
        case 37494:
        case 37495:
        case 37496:
        case 37497:
            return true;
        default:
            return false;
    }
}
/**
 * Waits for when the given texture is ready to be used (downloaded, converted, mip mapped...)
 * @param texture the texture to wait for
 * @returns a promise that resolves when the texture is ready
 */
export async function WhenTextureReadyAsync(texture) {
    if (texture.isReady()) {
        return;
    }
    if (texture.loadingError) {
        throw new Error(texture.errorObject?.message || `Texture ${texture.name} errored while loading.`);
    }
    const onLoadObservable = texture.onLoadObservable;
    if (onLoadObservable) {
        return await new Promise((res) => onLoadObservable.addOnce(() => res()));
    }
    const onLoadedObservable = texture._texture?.onLoadedObservable;
    if (onLoadedObservable) {
        return await new Promise((res) => onLoadedObservable.addOnce(() => res()));
    }
    throw new Error(`Cannot determine readiness of texture ${texture.name}.`);
}
/**
 * Gets the data of the specified texture by rendering it to an intermediate RGBA texture and retrieving the bytes from it.
 * This is convienent to get 8-bit RGBA values for a texture in a GPU compressed format, which cannot be read using readPixels.
 * @internal
 */
async function ReadPixelsUsingRTT(texture, width, height, face, lod) {
    const scene = texture.getScene();
    const engine = scene.getEngine();
    if (!engine.isWebGPU) {
        if (texture.isCube) {
            await import("../Shaders/lodCube.fragment.js");
        }
        else {
            await import("../Shaders/lod.fragment.js");
        }
    }
    else {
        if (texture.isCube) {
            await import("../ShadersWGSL/lodCube.fragment.js");
        }
        else {
            await import("../ShadersWGSL/lod.fragment.js");
        }
    }
    let lodPostProcess;
    if (!texture.isCube) {
        lodPostProcess = new PostProcess("lod", "lod", {
            uniforms: ["lod", "gamma"],
            samplingMode: Texture.NEAREST_NEAREST_MIPNEAREST,
            engine,
            shaderLanguage: engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
    }
    else {
        const faceDefines = ["#define POSITIVEX", "#define NEGATIVEX", "#define POSITIVEY", "#define NEGATIVEY", "#define POSITIVEZ", "#define NEGATIVEZ"];
        lodPostProcess = new PostProcess("lodCube", "lodCube", {
            uniforms: ["lod", "gamma"],
            samplingMode: Texture.NEAREST_NEAREST_MIPNEAREST,
            engine,
            defines: faceDefines[face],
            shaderLanguage: engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
    }
    await new Promise((resolve) => {
        lodPostProcess.onEffectCreatedObservable.addOnce((e) => {
            e.executeWhenCompiled(() => {
                resolve(0);
            });
        });
    });
    const rtt = new RenderTargetTexture("temp", { width: width, height: height }, scene, false);
    lodPostProcess.onApply = function (effect) {
        effect.setTexture("textureSampler", texture);
        effect.setFloat("lod", lod);
        effect.setInt("gamma", texture.gammaSpace ? 1 : 0);
    };
    const internalTexture = texture.getInternalTexture();
    try {
        if (rtt.renderTarget && internalTexture) {
            const samplingMode = internalTexture.samplingMode;
            if (lod !== 0) {
                texture.updateSamplingMode(Texture.NEAREST_NEAREST_MIPNEAREST);
            }
            else {
                texture.updateSamplingMode(Texture.NEAREST_NEAREST);
            }
            scene.postProcessManager.directRender([lodPostProcess], rtt.renderTarget, true);
            texture.updateSamplingMode(samplingMode);
            //Reading datas from WebGL
            const bufferView = await engine.readPixels(0, 0, width, height);
            const data = new Uint8Array(bufferView.buffer, 0, bufferView.byteLength);
            // Unbind
            engine.unBindFramebuffer(rtt.renderTarget);
            return data;
        }
        else {
            throw Error("Render to texture failed.");
        }
    }
    finally {
        rtt.dispose();
        lodPostProcess.dispose();
    }
}
/**
 * Gets the pixel data of the specified texture, either by reading it directly
 * or by rendering it to an intermediate RGBA texture and retrieving the bytes from it.
 * This is convenient to get 8-bit RGBA values for a texture in a GPU compressed format.
 * @param texture the source texture
 * @param width the target width of the result, which does not have to match the source texture width
 * @param height the target height of the result, which does not have to match the source texture height
 * @param face if the texture has multiple faces, the face index to use for the source
 * @param lod if the texture has multiple LODs, the lod index to use for the source
 * @returns the 8-bit texture data
 */
export async function GetTextureDataAsync(texture, width, height, face = 0, lod = 0) {
    await WhenTextureReadyAsync(texture);
    const { width: textureWidth, height: textureHeight } = texture.getSize();
    const targetWidth = width ?? textureWidth;
    const targetHeight = height ?? textureHeight;
    // If the internal texture format is compressed, we cannot read the pixels directly.
    // Or, if we're resizing the texture, we need to use a render target texture.
    if (IsCompressedTextureFormat(texture.textureFormat) || targetWidth !== textureWidth || targetHeight !== textureHeight) {
        return await ReadPixelsUsingRTT(texture, targetWidth, targetHeight, face, lod);
    }
    let data = (await texture.readPixels(face, lod));
    if (!data) {
        throw new Error(`Failed to read pixels from texture ${texture.name}.`);
    }
    // Convert float RGBA values to uint8, if necessary.
    if (data instanceof Float32Array) {
        const data2 = new Uint8Array(data.length);
        let n = data.length;
        while (n--) {
            const v = data[n];
            data2[n] = Math.round(Clamp(v) * 255);
        }
        data = data2;
    }
    return data;
}
/**
 * Class used to host texture specific utilities
 */
export const TextureTools = {
    /**
     * Uses the GPU to create a copy texture rescaled at a given size
     * @param texture Texture to copy from
     * @param width defines the desired width
     * @param height defines the desired height
     * @param useBilinearMode defines if bilinear mode has to be used
     * @returns the generated texture
     */
    CreateResizedCopy,
    /**
     * Apply a post process to a texture
     * @param postProcessName name of the fragment post process
     * @param internalTexture the texture to encode
     * @param scene the scene hosting the texture
     * @param type type of the output texture. If not provided, use the one from internalTexture
     * @param samplingMode sampling mode to use to sample the source texture. If not provided, use the one from internalTexture
     * @param format format of the output texture. If not provided, use the one from internalTexture
     * @returns a promise with the internalTexture having its texture replaced by the result of the processing
     */
    ApplyPostProcess,
    /**
     * Converts a number to half float
     * @param value number to convert
     * @returns converted number
     */
    ToHalfFloat,
    /**
     * Converts a half float to a number
     * @param value half float to convert
     * @returns converted half float
     */
    FromHalfFloat,
    /**
     * Gets the data of the specified texture by rendering it to an intermediate RGBA texture and retrieving the bytes from it.
     * This is convienent to get 8-bit RGBA values for a texture in a GPU compressed format.
     * @param texture the source texture
     * @param width the width of the result, which does not have to match the source texture width
     * @param height the height of the result, which does not have to match the source texture height
     * @param face if the texture has multiple faces, the face index to use for the source
     * @param lod if the texture has multiple LODs, the lod index to use for the source
     * @returns the 8-bit texture data
     */
    GetTextureDataAsync,
};
//# sourceMappingURL=textureTools.js.map