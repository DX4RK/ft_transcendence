/**
 * Base class for frame graph context.
 */
export class FrameGraphContext {
    /** @internal */
    constructor(_engine, _textureManager, _scene) {
        this._engine = _engine;
        this._textureManager = _textureManager;
        this._scene = _scene;
    }
    /**
     * Renders a component without managing the render target.
     * Use this method when you have a component that handles its own rendering logic which is not fully integrated into the frame graph system.
     * @param component The component to render.
     * @param intermediateRendering If true, the scene's intermediate rendering flag will be set to true during the render call (default: true)
     */
    renderUnmanaged(component, intermediateRendering = true) {
        const currentRenderTarget = this._engine._currentRenderTarget;
        this._scene.incrementRenderId();
        this._scene.resetCachedMaterial();
        this._scene._intermediateRendering = intermediateRendering;
        component.render();
        this._scene._intermediateRendering = false;
        if (this._engine._currentRenderTarget !== currentRenderTarget) {
            if (!currentRenderTarget) {
                this._engine.restoreDefaultFramebuffer();
            }
            else {
                this._engine.bindFramebuffer(currentRenderTarget);
            }
        }
    }
    /**
     * Gets a texture from a handle.
     * Note that if the texture is a history texture, the read texture for the current frame will be returned.
     * @param handle The handle of the texture
     * @returns The texture or null if not found
     */
    getTextureFromHandle(handle) {
        return this._textureManager.getTextureFromHandle(handle);
    }
    /**
     * Pushes a debug group to the engine's debug stack.
     * @param name The name of the debug group
     */
    pushDebugGroup(name) {
        this._engine._debugPushGroup?.(name, 1);
    }
    /**
     * Pops a debug group from the engine's debug stack.
     */
    popDebugGroup() {
        this._engine._debugPopGroup?.(1);
    }
    /**
     * Saves the current depth states (depth testing and depth writing)
     */
    saveDepthStates() {
        this._depthTest = this._engine.getDepthBuffer();
        this._depthWrite = this._engine.getDepthWrite();
    }
    /**
     * Restores the depth states saved by saveDepthStates
     */
    restoreDepthStates() {
        this._engine.setDepthBuffer(this._depthTest);
        this._engine.setDepthWrite(this._depthWrite);
    }
    /**
     * Sets the depth states for the current render target
     * @param depthTest If true, depth testing is enabled
     * @param depthWrite If true, depth writing is enabled
     */
    setDepthStates(depthTest, depthWrite) {
        this._engine.setDepthBuffer(depthTest);
        this._engine.setDepthWrite(depthWrite);
    }
}
//# sourceMappingURL=frameGraphContext.js.map