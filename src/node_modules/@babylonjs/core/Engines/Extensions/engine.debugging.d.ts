declare module "../../Engines/abstractEngine.js" {
    interface AbstractEngine {
        /** @internal */
        _debugPushGroup(groupName: string, targetObject?: number): void;
        /** @internal */
        _debugPopGroup(targetObject?: number): void;
        /** @internal */
        _debugInsertMarker(text: string, targetObject?: number): void;
        /** @internal */
        _debugFlushPendingCommands(): void;
    }
}
export {};
