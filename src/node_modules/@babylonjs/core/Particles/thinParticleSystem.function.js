import { Color4 } from "../Maths/math.color.js";
import { GradientHelper } from "../Misc/gradients.js";
import { Clamp, Lerp, RandomRange } from "../Maths/math.scalar.functions.js";
import { TmpVectors, Vector3, Vector4 } from "../Maths/math.vector.js";
/** Color */
/** @internal */
export function _CreateColorData(particle, system) {
    const step = RandomRange(0, 1.0);
    Color4.LerpToRef(system.color1, system.color2, step, particle.color);
}
/** @internal */
export function _CreateColorDeadData(particle, system) {
    system.colorDead.subtractToRef(particle.color, system._colorDiff);
    system._colorDiff.scaleToRef(1.0 / particle.lifeTime, particle.colorStep);
}
/** @internal */
export function _CreateColorGradientsData(particle, system) {
    particle._currentColorGradient = system._colorGradients[0];
    particle._currentColorGradient.getColorToRef(particle.color);
    particle._currentColor1.copyFrom(particle.color);
    if (system._colorGradients.length > 1) {
        system._colorGradients[1].getColorToRef(particle._currentColor2);
    }
    else {
        particle._currentColor2.copyFrom(particle.color);
    }
}
/** @internal */
export function _ProcessColorGradients(particle, system) {
    const colorGradients = system._colorGradients;
    GradientHelper.GetCurrentGradient(system._ratio, colorGradients, (currentGradient, nextGradient, scale) => {
        if (currentGradient !== particle._currentColorGradient) {
            particle._currentColor1.copyFrom(particle._currentColor2);
            nextGradient.getColorToRef(particle._currentColor2);
            particle._currentColorGradient = currentGradient;
        }
        Color4.LerpToRef(particle._currentColor1, particle._currentColor2, scale, particle.color);
    });
}
/** @internal */
export function _ProcessColor(particle, system) {
    particle.colorStep.scaleToRef(system._scaledUpdateSpeed, system._scaledColorStep);
    particle.color.addInPlace(system._scaledColorStep);
    if (particle.color.a < 0) {
        particle.color.a = 0;
    }
}
/** Angular speed */
/** @internal */
export function _ProcessAngularSpeedGradients(particle, system) {
    GradientHelper.GetCurrentGradient(system._ratio, system._angularSpeedGradients, (currentGradient, nextGradient, scale) => {
        if (currentGradient !== particle._currentAngularSpeedGradient) {
            particle._currentAngularSpeed1 = particle._currentAngularSpeed2;
            particle._currentAngularSpeed2 = nextGradient.getFactor();
            particle._currentAngularSpeedGradient = currentGradient;
        }
        particle.angularSpeed = Lerp(particle._currentAngularSpeed1, particle._currentAngularSpeed2, scale);
    });
}
/** @internal */
export function _ProcessAngularSpeed(particle, system) {
    particle.angle += particle.angularSpeed * system._scaledUpdateSpeed;
}
/** Velocity & direction */
/** @internal */
export function _CreateDirectionData(particle, system) {
    system.particleEmitterType.startDirectionFunction(system._emitterWorldMatrix, particle.direction, particle, system.isLocal, system._emitterInverseWorldMatrix);
}
/** @internal */
export function _CreateCustomDirectionData(particle, system) {
    system.startDirectionFunction(system._emitterWorldMatrix, particle.direction, particle, system.isLocal);
}
/** @internal */
export function _CreateVelocityGradients(particle, system) {
    particle._currentVelocityGradient = system._velocityGradients[0];
    particle._currentVelocity1 = particle._currentVelocityGradient.getFactor();
    if (system._velocityGradients.length > 1) {
        particle._currentVelocity2 = system._velocityGradients[1].getFactor();
    }
    else {
        particle._currentVelocity2 = particle._currentVelocity1;
    }
}
/** @internal */
export function _CreateLimitVelocityGradients(particle, system) {
    particle._currentLimitVelocityGradient = system._limitVelocityGradients[0];
    particle._currentLimitVelocity1 = particle._currentLimitVelocityGradient.getFactor();
    if (system._limitVelocityGradients.length > 1) {
        particle._currentLimitVelocity2 = system._limitVelocityGradients[1].getFactor();
    }
    else {
        particle._currentLimitVelocity2 = particle._currentLimitVelocity1;
    }
}
/** @internal */
export function _ProcessVelocityGradients(particle, system) {
    GradientHelper.GetCurrentGradient(system._ratio, system._velocityGradients, (currentGradient, nextGradient, scale) => {
        if (currentGradient !== particle._currentVelocityGradient) {
            particle._currentVelocity1 = particle._currentVelocity2;
            particle._currentVelocity2 = nextGradient.getFactor();
            particle._currentVelocityGradient = currentGradient;
        }
        system._directionScale *= Lerp(particle._currentVelocity1, particle._currentVelocity2, scale);
    });
}
/** @internal */
export function _ProcessLimitVelocityGradients(particle, system) {
    GradientHelper.GetCurrentGradient(system._ratio, system._limitVelocityGradients, (currentGradient, nextGradient, scale) => {
        if (currentGradient !== particle._currentLimitVelocityGradient) {
            particle._currentLimitVelocity1 = particle._currentLimitVelocity2;
            particle._currentLimitVelocity2 = nextGradient.getFactor();
            particle._currentLimitVelocityGradient = currentGradient;
        }
        const limitVelocity = Lerp(particle._currentLimitVelocity1, particle._currentLimitVelocity2, scale);
        const currentVelocity = particle.direction.length();
        if (currentVelocity > limitVelocity) {
            particle.direction.scaleInPlace(system.limitVelocityDamping);
        }
    });
}
/** @internal */
export function _ProcessDirection(particle, system) {
    particle.direction.scaleToRef(system._directionScale, system._scaledDirection);
}
/** Position */
/** @internal */
export function _CreatePositionData(particle, system) {
    system.particleEmitterType.startPositionFunction(system._emitterWorldMatrix, particle.position, particle, system.isLocal);
}
/** @internal */
export function _CreateCustomPositionData(particle, system) {
    system.startPositionFunction(system._emitterWorldMatrix, particle.position, particle, system.isLocal);
}
/** @internal */
export function _CreateIsLocalData(particle, system) {
    if (!particle._localPosition) {
        particle._localPosition = particle.position.clone();
    }
    else {
        particle._localPosition.copyFrom(particle.position);
    }
    Vector3.TransformCoordinatesToRef(particle._localPosition, system._emitterWorldMatrix, particle.position);
}
/** @internal */
export function _ProcessPosition(particle, system) {
    if (system.isLocal && particle._localPosition) {
        particle._localPosition.addInPlace(system._scaledDirection);
        Vector3.TransformCoordinatesToRef(particle._localPosition, system._emitterWorldMatrix, particle.position);
    }
    else {
        particle.position.addInPlace(system._scaledDirection);
    }
}
/** Drag */
/** @internal */
export function _CreateDragData(particle, system) {
    particle._currentDragGradient = system._dragGradients[0];
    particle._currentDrag1 = particle._currentDragGradient.getFactor();
    if (system._dragGradients.length > 1) {
        particle._currentDrag2 = system._dragGradients[1].getFactor();
    }
    else {
        particle._currentDrag2 = particle._currentDrag1;
    }
}
/** @internal */
export function _ProcessDragGradients(particle, system) {
    GradientHelper.GetCurrentGradient(system._ratio, system._dragGradients, (currentGradient, nextGradient, scale) => {
        if (currentGradient !== particle._currentDragGradient) {
            particle._currentDrag1 = particle._currentDrag2;
            particle._currentDrag2 = nextGradient.getFactor();
            particle._currentDragGradient = currentGradient;
        }
        const drag = Lerp(particle._currentDrag1, particle._currentDrag2, scale);
        system._scaledDirection.scaleInPlace(1.0 - drag);
    });
}
/** Noise */
/** @internal */
export function _CreateNoiseData(particle, system) {
    if (particle._randomNoiseCoordinates1) {
        particle._randomNoiseCoordinates1.copyFromFloats(Math.random(), Math.random(), Math.random());
        particle._randomNoiseCoordinates2.copyFromFloats(Math.random(), Math.random(), Math.random());
    }
    else {
        particle._randomNoiseCoordinates1 = new Vector3(Math.random(), Math.random(), Math.random());
        particle._randomNoiseCoordinates2 = new Vector3(Math.random(), Math.random(), Math.random());
    }
}
/** @internal */
export function _ProcessNoise(particle, system) {
    const noiseTextureData = system._noiseTextureData;
    const noiseTextureSize = system._noiseTextureSize;
    if (noiseTextureData && noiseTextureSize && particle._randomNoiseCoordinates1) {
        const fetchedColorR = system._fetchR(particle._randomNoiseCoordinates1.x, particle._randomNoiseCoordinates1.y, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
        const fetchedColorG = system._fetchR(particle._randomNoiseCoordinates1.z, particle._randomNoiseCoordinates2.x, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
        const fetchedColorB = system._fetchR(particle._randomNoiseCoordinates2.y, particle._randomNoiseCoordinates2.z, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
        const force = TmpVectors.Vector3[0];
        const scaledForce = TmpVectors.Vector3[1];
        force.copyFromFloats((2 * fetchedColorR - 1) * system.noiseStrength.x, (2 * fetchedColorG - 1) * system.noiseStrength.y, (2 * fetchedColorB - 1) * system.noiseStrength.z);
        force.scaleToRef(system._tempScaledUpdateSpeed, scaledForce);
        particle.direction.addInPlace(scaledForce);
    }
}
/** Gravity */
/** @internal */
export function _ProcessGravity(particle, system) {
    system.gravity.scaleToRef(system._tempScaledUpdateSpeed, system._scaledGravity);
    particle.direction.addInPlace(system._scaledGravity);
}
/** Size */
/** @internal */
export function _CreateSizeData(particle, system) {
    particle.size = RandomRange(system.minSize, system.maxSize);
    particle.scale.copyFromFloats(RandomRange(system.minScaleX, system.maxScaleX), RandomRange(system.minScaleY, system.maxScaleY));
}
/** @internal */
export function _CreateSizeGradientsData(particle, system) {
    particle._currentSizeGradient = system._sizeGradients[0];
    particle._currentSize1 = particle._currentSizeGradient.getFactor();
    particle.size = particle._currentSize1;
    if (system._sizeGradients.length > 1) {
        particle._currentSize2 = system._sizeGradients[1].getFactor();
    }
    else {
        particle._currentSize2 = particle._currentSize1;
    }
    particle.scale.copyFromFloats(RandomRange(system.minScaleX, system.maxScaleX), RandomRange(system.minScaleY, system.maxScaleY));
}
/** @internal */
export function _CreateStartSizeGradientsData(particle, system) {
    const ratio = system._actualFrame / system.targetStopDuration;
    GradientHelper.GetCurrentGradient(ratio, system._startSizeGradients, (currentGradient, nextGradient, scale) => {
        if (currentGradient !== system._currentStartSizeGradient) {
            system._currentStartSize1 = system._currentStartSize2;
            system._currentStartSize2 = nextGradient.getFactor();
            system._currentStartSizeGradient = currentGradient;
        }
        const value = Lerp(system._currentStartSize1, system._currentStartSize2, scale);
        particle.scale.scaleInPlace(value);
    });
}
/** @internal */
export function _ProcessSizeGradients(particle, system) {
    GradientHelper.GetCurrentGradient(system._ratio, system._sizeGradients, (currentGradient, nextGradient, scale) => {
        if (currentGradient !== particle._currentSizeGradient) {
            particle._currentSize1 = particle._currentSize2;
            particle._currentSize2 = nextGradient.getFactor();
            particle._currentSizeGradient = currentGradient;
        }
        particle.size = Lerp(particle._currentSize1, particle._currentSize2, scale);
    });
}
/** Ramp */
/** @internal */
export function _CreateRampData(particle, system) {
    particle.remapData = new Vector4(0, 1, 0, 1);
}
/** Remap */
/** @internal */
export function _ProcessRemapGradients(particle, system) {
    if (system._colorRemapGradients && system._colorRemapGradients.length > 0) {
        GradientHelper.GetCurrentGradient(system._ratio, system._colorRemapGradients, (currentGradient, nextGradient, scale) => {
            const min = Lerp(currentGradient.factor1, nextGradient.factor1, scale);
            const max = Lerp(currentGradient.factor2, nextGradient.factor2, scale);
            particle.remapData.x = min;
            particle.remapData.y = max - min;
        });
    }
    if (system._alphaRemapGradients && system._alphaRemapGradients.length > 0) {
        GradientHelper.GetCurrentGradient(system._ratio, system._alphaRemapGradients, (currentGradient, nextGradient, scale) => {
            const min = Lerp(currentGradient.factor1, nextGradient.factor1, scale);
            const max = Lerp(currentGradient.factor2, nextGradient.factor2, scale);
            particle.remapData.z = min;
            particle.remapData.w = max - min;
        });
    }
}
/** Life */
/** @internal */
export function _CreateLifeGradientsData(particle, system) {
    const ratio = Clamp(system._actualFrame / system.targetStopDuration);
    GradientHelper.GetCurrentGradient(ratio, system._lifeTimeGradients, (currentGradient, nextGradient) => {
        const factorGradient1 = currentGradient;
        const factorGradient2 = nextGradient;
        const lifeTime1 = factorGradient1.getFactor();
        const lifeTime2 = factorGradient2.getFactor();
        const gradient = (ratio - factorGradient1.gradient) / (factorGradient2.gradient - factorGradient1.gradient);
        particle.lifeTime = Lerp(lifeTime1, lifeTime2, gradient);
    });
    system._emitPower = RandomRange(system.minEmitPower, system.maxEmitPower);
}
/** @internal */
export function _CreateLifetimeData(particle, system) {
    particle.lifeTime = RandomRange(system.minLifeTime, system.maxLifeTime);
    system._emitPower = RandomRange(system.minEmitPower, system.maxEmitPower);
}
/** Emit power */
/** @internal */
export function _CreateEmitPowerData(particle, system) {
    if (system._emitPower === 0) {
        if (!particle._initialDirection) {
            particle._initialDirection = particle.direction.clone();
        }
        else {
            particle._initialDirection.copyFrom(particle.direction);
        }
        particle.direction.set(0, 0, 0);
    }
    else {
        particle._initialDirection = null;
        particle.direction.scaleInPlace(system._emitPower);
    }
    // Inherited Velocity
    particle.direction.addInPlace(system._inheritedVelocityOffset);
}
/** Angle */
/** @internal */
export function _CreateAngleData(particle, system) {
    particle.angularSpeed = RandomRange(system.minAngularSpeed, system.maxAngularSpeed);
    particle.angle = RandomRange(system.minInitialRotation, system.maxInitialRotation);
}
/** @internal */
export function _CreateAngleGradientsData(particle, system) {
    particle._currentAngularSpeedGradient = system._angularSpeedGradients[0];
    particle.angularSpeed = particle._currentAngularSpeedGradient.getFactor();
    particle._currentAngularSpeed1 = particle.angularSpeed;
    if (system._angularSpeedGradients.length > 1) {
        particle._currentAngularSpeed2 = system._angularSpeedGradients[1].getFactor();
    }
    else {
        particle._currentAngularSpeed2 = particle._currentAngularSpeed1;
    }
    particle.angle = RandomRange(system.minInitialRotation, system.maxInitialRotation);
}
/** Sheet */
/** @internal */
export function _CreateSheetData(particle, system) {
    particle._initialStartSpriteCellId = system.startSpriteCellID;
    particle._initialEndSpriteCellId = system.endSpriteCellID;
    particle._initialSpriteCellLoop = system.spriteCellLoop;
}
//# sourceMappingURL=thinParticleSystem.function.js.map