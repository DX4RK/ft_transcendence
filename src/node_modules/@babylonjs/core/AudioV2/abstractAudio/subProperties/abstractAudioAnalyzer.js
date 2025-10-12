export const _AudioAnalyzerDefaults = {
    fftSize: 2048,
    minDecibels: -100,
    maxDecibels: -30,
    smoothing: 0.8,
};
/**
 * @param options The audio analyzer options to check.
 * @returns `true` if audio analyzer options are defined, otherwise `false`.
 */
export function _HasAudioAnalyzerOptions(options) {
    return (options.analyzerEnabled ||
        options.analyzerFFTSize !== undefined ||
        options.analyzerMinDecibels !== undefined ||
        options.analyzerMaxDecibels !== undefined ||
        options.analyzerSmoothing !== undefined);
}
/**
 * An AudioAnalyzer converts time-domain audio data into the frequency-domain.
 */
export class AbstractAudioAnalyzer {
    /**
     * The number of data values that will be returned when calling getByteFrequencyData() or getFloatFrequencyData(). This is always half the `fftSize`.
     */
    get frequencyBinCount() {
        return this.fftSize / 2;
    }
}
//# sourceMappingURL=abstractAudioAnalyzer.js.map