import type { Scene } from "../../scene.js";
import { AssetContainer } from "../../assetContainer.js";
/** @internal */
export declare var _BabylonLoaderRegistered: boolean;
/**
 * Helps setting up some configuration for the babylon file loader.
 */
export declare class BabylonFileLoaderConfiguration {
    /**
     * The loader does not allow injecting custom physics engine into the plugins.
     * Unfortunately in ES6, we need to manually inject them into the plugin.
     * So you could set this variable to your engine import to make it work.
     */
    static LoaderInjectedPhysicsEngine: any;
}
/**
 * @experimental
 * Loads an AssetContainer from a serialized Babylon scene.
 * @param scene The scene to load the asset container into.
 * @param serializedScene The serialized scene data. This can be either a JSON string, or an object (e.g. from a call to JSON.parse).
 * @param rootUrl The root URL for loading assets.
 * @returns The loaded AssetContainer.
 */
export declare function LoadAssetContainerFromSerializedScene(scene: Scene, serializedScene: string | object, rootUrl: string): AssetContainer;
