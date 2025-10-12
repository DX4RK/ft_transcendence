import { _GetAudioParamCurveValues } from "../../audioUtils.js";
/**
 * Maximum time in seconds to wait for an active ramp to finish before starting a new ramp.
 *
 * New ramps will throw an error if the active ramp has more than this amount of time remaining.
 *
 * This is needed because short ramps are used to avoid pops and clicks when setting audio parameters, and we
 * don't want to throw an error if a short ramp is active.
 *
 * This constant is set to 11 milliseconds, which is short enough to avoid perceptual differences in most cases, but
 * long enough to allow for short ramps to be completed in a reasonable time frame.
 */
const MaxWaitTime = 0.011;
/**
 * Minimum duration in seconds for a ramp to be considered valid.
 *
 * If the duration is less than this value, the value will be set immediately instead of being ramped smoothly since
 * there is no perceptual difference for such short durations, so a ramp is not needed.
 */
const MinRampDuration = 0.000001;
/** @internal */
export class _WebAudioParameterComponent {
    /** @internal */
    constructor(engine, param) {
        this._deferredRampOptions = {
            duration: 0,
            shape: "linear" /* AudioParameterRampShape.Linear */,
        };
        this._deferredTargetValue = -1;
        this._isObservingUpdates = false;
        this._rampEndTime = 0;
        this._applyDeferredRamp = () => {
            if (0 < this._deferredRampOptions.duration && this._rampEndTime < this._engine.currentTime) {
                this.setTargetValue(this._deferredTargetValue, this._deferredRampOptions);
            }
        };
        this._engine = engine;
        this._param = param;
        this._targetValue = param.value;
    }
    /** @internal */
    get isRamping() {
        return this._engine.currentTime < this._rampEndTime;
    }
    /** @internal */
    get targetValue() {
        return this._targetValue;
    }
    set targetValue(value) {
        this.setTargetValue(value);
    }
    /** @internal */
    get value() {
        return this._param.value;
    }
    /** @internal */
    dispose() {
        this._clearDeferredRamp();
        this._param = null;
        this._engine = null;
    }
    /**
     * Sets the target value of the audio parameter with an optional ramping duration and shape.
     *
     * If a ramp is close to finishing, it will wait for the ramp to finish before setting the new value; otherwise it
     * will throw an error because of a bug in Firefox that prevents active ramps from being cancelled with
     * `cancelScheduledValues`. See https://bugzilla.mozilla.org/show_bug.cgi?id=1752775. Other browsers do not have
     * this issue, but we throw an error in all browsers to ensure consistent behavior.
     *
     * There are other similar WebAudio APIs for ramping parameters, (e.g. `linearRampToValueAtTime` and
     * `exponentialRampToValueAtTime`) but they don't work in Firefox and Meta Quest Chrome.
     *
     * It may be better in the long run to implement our own ramping logic with a WASM audio worklet instead of using
     * `setValueCurveAtTime`. Another alternative is to use `setValueAtTime` wtih a custom shape, but that will
     * probably be a performance hit to maintain quality at audio rates.
     *
     * @internal
     */
    setTargetValue(value, options = null) {
        if (this._targetValue === value) {
            return;
        }
        const shape = typeof options?.shape === "string" ? options.shape : "linear" /* AudioParameterRampShape.Linear */;
        let duration = typeof options?.duration === "number" ? Math.max(options.duration, this._engine.parameterRampDuration) : this._engine.parameterRampDuration;
        const startTime = this._engine.currentTime;
        if (startTime < this._rampEndTime) {
            const timeLeft = this._rampEndTime - startTime;
            if (MaxWaitTime < timeLeft) {
                throw new Error("Audio parameter not set. Wait for current ramp to finish.");
            }
            else {
                this._deferRamp(value, duration, shape);
                return;
            }
        }
        if ((duration = Math.max(this._engine.parameterRampDuration, duration)) < MinRampDuration) {
            this._param.setValueAtTime((this._targetValue = value), startTime);
            return;
        }
        this._param.cancelScheduledValues(startTime);
        this._param.setValueCurveAtTime(_GetAudioParamCurveValues(shape, this._targetValue, (this._targetValue = value)), startTime, duration);
        this._clearDeferredRamp();
        this._rampEndTime = startTime + duration;
    }
    _deferRamp(value, duration, shape) {
        this._deferredRampOptions.duration = duration;
        this._deferredRampOptions.shape = shape;
        this._deferredTargetValue = value;
        if (!this._isObservingUpdates) {
            this._engine._addUpdateObserver(this._applyDeferredRamp);
            this._isObservingUpdates = true;
        }
    }
    _clearDeferredRamp() {
        this._deferredRampOptions.duration = 0;
        if (this._isObservingUpdates) {
            this._engine._removeUpdateObserver(this._applyDeferredRamp);
            this._isObservingUpdates = false;
        }
    }
}
//# sourceMappingURL=webAudioParameterComponent.js.map