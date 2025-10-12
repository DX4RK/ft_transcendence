import { __decorate } from "../../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
/**
 * Block used as configure the sprite sheet for particles
 */
export class SetupSpriteSheetBlock extends NodeParticleBlock {
    /**
     * Creates a new SetupSpriteSheetBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name);
        /**
         * Gets or sets the start cell of the sprite sheet
         */
        this.start = 0;
        /**
         * Gets or sets the end cell of the sprite sheet
         */
        this.end = 8;
        /**
         * Gets or sets the width of the sprite sheet
         */
        this.width = 64;
        /**
         * Gets or sets the height of the sprite sheet
         */
        this.height = 64;
        /**
         * Gets or sets a boolean indicating if the sprite sheet should loop
         */
        this.loop = false;
        /**
         * Gets or sets a boolean indicating if the sprite sheet should start at a random cell
         */
        this.randomStartCell = false;
        this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
        this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "SetupSpriteSheetBlock";
    }
    /**
     * Gets the particle component
     */
    get particle() {
        return this._inputs[0];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _build(state) {
        super._build(state);
        const system = this.particle.getConnectedValue(state);
        system._isAnimationSheetEnabled = true;
        system.spriteCellWidth = this.width;
        system.spriteCellHeight = this.height;
        system.startSpriteCellID = this.start;
        system.endSpriteCellID = this.end;
        system.spriteRandomStartCell = this.randomStartCell;
        this.output._storedValue = system;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.width = this.width;
        serializationObject.height = this.height;
        serializationObject.start = this.start;
        serializationObject.end = this.end;
        serializationObject.randomStartCell = this.randomStartCell;
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this.width = serializationObject.width;
        this.height = serializationObject.height;
        this.start = serializationObject.start;
        this.end = serializationObject.end;
        this.randomStartCell = serializationObject.randomStartCell;
    }
}
__decorate([
    editableInPropertyPage("Start", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })
], SetupSpriteSheetBlock.prototype, "start", void 0);
__decorate([
    editableInPropertyPage("End", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })
], SetupSpriteSheetBlock.prototype, "end", void 0);
__decorate([
    editableInPropertyPage("Width", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })
], SetupSpriteSheetBlock.prototype, "width", void 0);
__decorate([
    editableInPropertyPage("Height", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })
], SetupSpriteSheetBlock.prototype, "height", void 0);
__decorate([
    editableInPropertyPage("Loop", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })
], SetupSpriteSheetBlock.prototype, "loop", void 0);
__decorate([
    editableInPropertyPage("Random start cell", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })
], SetupSpriteSheetBlock.prototype, "randomStartCell", void 0);
RegisterClass("BABYLON.SetupSpriteSheetBlock", SetupSpriteSheetBlock);
//# sourceMappingURL=setupSpriteSheetBlock.js.map