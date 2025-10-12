import { AbstractEngine } from "../abstractEngine.js";

AbstractEngine.prototype.setAlphaEquation = function (equation, targetIndex = 0) {
    if (this._alphaEquation[targetIndex] === equation) {
        return;
    }
    switch (equation) {
        case 0:
            this._alphaState.setAlphaEquationParameters(32774, 32774, targetIndex);
            break;
        case 1:
            this._alphaState.setAlphaEquationParameters(32778, 32778, targetIndex);
            break;
        case 2:
            this._alphaState.setAlphaEquationParameters(32779, 32779, targetIndex);
            break;
        case 3:
            this._alphaState.setAlphaEquationParameters(32776, 32776, targetIndex);
            break;
        case 4:
            this._alphaState.setAlphaEquationParameters(32775, 32775, targetIndex);
            break;
        case 5:
            this._alphaState.setAlphaEquationParameters(32775, 32774, targetIndex);
            break;
    }
    this._alphaEquation[targetIndex] = equation;
};
//# sourceMappingURL=abstractEngine.alpha.js.map