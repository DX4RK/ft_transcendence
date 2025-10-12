import { NodeParticleSystemSet } from "./nodeParticleSystemSet.js";
import { SystemBlock } from "./Blocks/systemBlock.js";
import { CreateParticleBlock } from "./Blocks/Emitters/createParticleBlock.js";
import { BoxShapeBlock } from "./Blocks/Emitters/boxShapeBlock.js";
import { ParticleInputBlock } from "./Blocks/particleInputBlock.js";
import { PointShapeBlock } from "./Blocks/Emitters/pointShapeBlock.js";
import { SphereShapeBlock } from "./Blocks/Emitters/sphereShapeBlock.js";
import { CylinderShapeBlock } from "./Blocks/Emitters/cylinderShapeBlock.js";
import { MeshShapeBlock } from "./Blocks/Emitters/meshShapeBlock.js";
import { ParticleTextureSourceBlock } from "./Blocks/particleSourceTextureBlock.js";
import { BasicPositionUpdateBlock } from "./Blocks/Update/basicPositionUpdateBlock.js";
import { BasicColorUpdateBlock } from "./Blocks/Update/basicColorUpdateBlock.js";
import { ParticleRandomBlock } from "./Blocks/particleRandomBlock.js";
function _CreateAndConnectInput(connectionPoint, name, defaultValue) {
    const input = new ParticleInputBlock(name);
    input.value = defaultValue;
    input.output.connectTo(connectionPoint);
}
async function _ExtractDatafromParticleSystemAsync(particleSystem, target) {
    // Main system
    const system = new SystemBlock(particleSystem.name);
    system.capacity = particleSystem.getCapacity();
    system.emitRate = particleSystem.emitRate;
    // Create particle
    const createParticleBlock = new CreateParticleBlock("Create particle");
    // Shape
    let shapeBlock = null;
    switch (particleSystem.particleEmitterType.getClassName()) {
        case "BoxParticleEmitter": {
            const source = particleSystem.particleEmitterType;
            shapeBlock = new BoxShapeBlock("Box shape");
            const target = shapeBlock;
            _CreateAndConnectInput(target.direction1, "Direction 1", source.direction1);
            _CreateAndConnectInput(target.direction2, "Direction 2", source.direction2);
            _CreateAndConnectInput(target.minEmitBox, "Min Emit Box", source.minEmitBox);
            _CreateAndConnectInput(target.maxEmitBox, "Max Emit Box", source.maxEmitBox);
            break;
        }
        case "PointParticleEmitter": {
            const source = particleSystem.particleEmitterType;
            shapeBlock = new PointShapeBlock("Point shape");
            const target = shapeBlock;
            _CreateAndConnectInput(target.direction1, "Direction 1", source.direction1);
            _CreateAndConnectInput(target.direction2, "Direction 2", source.direction2);
            break;
        }
        case "SphereParticleEmitter": {
            const source = particleSystem.particleEmitterType;
            shapeBlock = new SphereShapeBlock("Sphere shape");
            const target = shapeBlock;
            _CreateAndConnectInput(target.radius, "Radius", source.radius);
            _CreateAndConnectInput(target.radiusRange, "Radius Range", source.radiusRange);
            _CreateAndConnectInput(target.directionRandomizer, "Direction Randomizer", source.directionRandomizer);
            break;
        }
        case "CylinderParticleEmitter": {
            const source = particleSystem.particleEmitterType;
            shapeBlock = new CylinderShapeBlock("Cylinder shape");
            const target = shapeBlock;
            _CreateAndConnectInput(target.height, "Height", source.height);
            _CreateAndConnectInput(target.radius, "Radius", source.radius);
            _CreateAndConnectInput(target.radiusRange, "Radius Range", source.radiusRange);
            _CreateAndConnectInput(target.directionRandomizer, "Direction Randomizer", source.directionRandomizer);
            break;
        }
        case "MeshParticleEmitter": {
            const source = particleSystem.particleEmitterType;
            shapeBlock = new MeshShapeBlock("Mesh shape");
            const target = shapeBlock;
            _CreateAndConnectInput(target.direction1, "Direction 1", source.direction1);
            _CreateAndConnectInput(target.direction2, "Direction 2", source.direction2);
            target.mesh = source.mesh;
            break;
        }
    }
    if (!shapeBlock) {
        throw new Error(`Unsupported particle emitter type: ${particleSystem.particleEmitterType.getClassName()}`);
    }
    createParticleBlock.particle.connectTo(shapeBlock.particle);
    createParticleBlock.colorDead.value = particleSystem.colorDead;
    // Color
    const color0Block = new ParticleInputBlock("Color0");
    color0Block.value = particleSystem.color1;
    const color1Block = new ParticleInputBlock("Color1");
    color1Block.value = particleSystem.color2;
    const randomColorBlock = new ParticleRandomBlock("Random Color");
    color0Block.output.connectTo(randomColorBlock.min);
    color1Block.output.connectTo(randomColorBlock.max);
    randomColorBlock.output.connectTo(createParticleBlock.color);
    // Emit power
    const minEmitPowerBlock = new ParticleInputBlock("Min Emit Power");
    minEmitPowerBlock.value = particleSystem.minEmitPower;
    const maxEmitPowerBlock = new ParticleInputBlock("Max Emit Power");
    maxEmitPowerBlock.value = particleSystem.maxEmitPower;
    const randomEmitPowerBlock = new ParticleRandomBlock("Random Emit Power");
    minEmitPowerBlock.output.connectTo(randomEmitPowerBlock.min);
    maxEmitPowerBlock.output.connectTo(randomEmitPowerBlock.max);
    randomEmitPowerBlock.output.connectTo(createParticleBlock.emitPower);
    // Lifetime
    const minLifetimeBlock = new ParticleInputBlock("Min Lifetime");
    minLifetimeBlock.value = particleSystem.minLifeTime;
    const maxLifetimeBlock = new ParticleInputBlock("Max Lifetime");
    maxLifetimeBlock.value = particleSystem.maxLifeTime;
    const randomLifetimeBlock = new ParticleRandomBlock("Random Lifetime");
    minLifetimeBlock.output.connectTo(randomLifetimeBlock.min);
    maxLifetimeBlock.output.connectTo(randomLifetimeBlock.max);
    randomLifetimeBlock.output.connectTo(createParticleBlock.lifeTime);
    // Texture
    const textureBlock = new ParticleTextureSourceBlock("Texture");
    const url = particleSystem.particleTexture.url || "";
    if (url) {
        textureBlock.url = url;
    }
    else {
        textureBlock.sourceTexture = particleSystem.particleTexture;
    }
    textureBlock.texture.connectTo(system.texture);
    // Default position update
    const basicPositionUpdateBlock = new BasicPositionUpdateBlock("Position update");
    shapeBlock.output.connectTo(basicPositionUpdateBlock.particle);
    // Default color update
    const basicColorUpdateBlock = new BasicColorUpdateBlock("Color update");
    basicPositionUpdateBlock.output.connectTo(basicColorUpdateBlock.particle);
    basicColorUpdateBlock.output.connectTo(system.particle);
    // Register
    target.systemBlocks.push(system);
}
/**
 * Converts a ParticleSystem to a NodeParticleSystemSet.
 * @param name The name of the node particle system set.
 * @param particleSystems The particle systems to convert.
 * @returns The converted node particle system set or null if conversion failed.
 * #0K3AQ2#3627
 */
export async function ConvertToNodeParticleSystemSetAsync(name, particleSystems) {
    if (!particleSystems || !particleSystems.length) {
        return null;
    }
    const nodeParticleSystemSet = new NodeParticleSystemSet(name);
    const promises = [];
    for (const particleSystem of particleSystems) {
        promises.push(_ExtractDatafromParticleSystemAsync(particleSystem, nodeParticleSystemSet));
    }
    await Promise.all(promises);
    return nodeParticleSystemSet;
}
//# sourceMappingURL=nodeParticleSystemSet.helper.js.map