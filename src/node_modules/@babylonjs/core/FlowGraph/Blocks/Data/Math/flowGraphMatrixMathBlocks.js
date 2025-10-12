import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { getRichTypeByFlowGraphType, RichTypeBoolean, RichTypeMatrix, RichTypeNumber, RichTypeQuaternion, RichTypeVector3, } from "../../../flowGraphRichTypes.js";
import { Matrix, Quaternion, Vector3 } from "../../../../Maths/math.vector.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock.js";
/**
 * Transposes a matrix.
 */
export class FlowGraphTransposeBlock extends FlowGraphUnaryOperationBlock {
    /**
     * Creates a new instance of the block.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), (a) => (a.transpose ? a.transpose() : Matrix.Transpose(a)), "FlowGraphTransposeBlock" /* FlowGraphBlockNames.Transpose */, config);
    }
}
RegisterClass("FlowGraphTransposeBlock" /* FlowGraphBlockNames.Transpose */, FlowGraphTransposeBlock);
/**
 * Gets the determinant of a matrix.
 */
export class FlowGraphDeterminantBlock extends FlowGraphUnaryOperationBlock {
    /**
     * Creates a new instance of the block.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), RichTypeNumber, (a) => a.determinant(), "FlowGraphDeterminantBlock" /* FlowGraphBlockNames.Determinant */, config);
    }
}
RegisterClass("FlowGraphDeterminantBlock" /* FlowGraphBlockNames.Determinant */, FlowGraphDeterminantBlock);
/**
 * Inverts a matrix.
 */
export class FlowGraphInvertMatrixBlock extends FlowGraphUnaryOperationBlock {
    /**
     * Creates a new instance of the inverse block.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), (a) => (a.inverse ? a.inverse() : Matrix.Invert(a)), "FlowGraphInvertMatrixBlock" /* FlowGraphBlockNames.InvertMatrix */, config);
    }
}
RegisterClass("FlowGraphInvertMatrixBlock" /* FlowGraphBlockNames.InvertMatrix */, FlowGraphInvertMatrixBlock);
/**
 * Multiplies two matrices.
 */
export class FlowGraphMatrixMultiplicationBlock extends FlowGraphBinaryOperationBlock {
    /**
     * Creates a new instance of the multiplication block.
     * Note - this is similar to the math multiplication if not using matrix per-component multiplication.
     * @param config the configuration of the block
     */
    constructor(config) {
        super(getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), getRichTypeByFlowGraphType(config?.matrixType || "Matrix" /* FlowGraphTypes.Matrix */), (a, b) => b.multiply(a), "FlowGraphMatrixMultiplicationBlock" /* FlowGraphBlockNames.MatrixMultiplication */, config);
    }
}
RegisterClass("FlowGraphMatrixMultiplicationBlock" /* FlowGraphBlockNames.MatrixMultiplication */, FlowGraphMatrixMultiplicationBlock);
/**
 * Matrix decompose block
 */
export class FlowGraphMatrixDecomposeBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.input = this.registerDataInput("input", RichTypeMatrix);
        this.position = this.registerDataOutput("position", RichTypeVector3);
        this.rotationQuaternion = this.registerDataOutput("rotationQuaternion", RichTypeQuaternion);
        this.scaling = this.registerDataOutput("scaling", RichTypeVector3);
        this.isValid = this.registerDataOutput("isValid", RichTypeBoolean, false);
    }
    _updateOutputs(context) {
        const cachedExecutionId = context._getExecutionVariable(this, "executionId", -1);
        const cachedPosition = context._getExecutionVariable(this, "cachedPosition", null);
        const cachedRotation = context._getExecutionVariable(this, "cachedRotation", null);
        const cachedScaling = context._getExecutionVariable(this, "cachedScaling", null);
        if (cachedExecutionId === context.executionId && cachedPosition && cachedRotation && cachedScaling) {
            this.position.setValue(cachedPosition, context);
            this.rotationQuaternion.setValue(cachedRotation, context);
            this.scaling.setValue(cachedScaling, context);
        }
        else {
            const matrix = this.input.getValue(context);
            const position = cachedPosition || new Vector3();
            const rotation = cachedRotation || new Quaternion();
            const scaling = cachedScaling || new Vector3();
            // check matrix last column components should be 0,0,0,1
            // round them to 4 decimal places
            const m3 = Math.round(matrix.m[3] * 10000) / 10000;
            const m7 = Math.round(matrix.m[7] * 10000) / 10000;
            const m11 = Math.round(matrix.m[11] * 10000) / 10000;
            const m15 = Math.round(matrix.m[15] * 10000) / 10000;
            if (m3 !== 0 || m7 !== 0 || m11 !== 0 || m15 !== 1) {
                this.isValid.setValue(false, context);
                this.position.setValue(Vector3.Zero(), context);
                this.rotationQuaternion.setValue(Quaternion.Identity(), context);
                this.scaling.setValue(Vector3.One(), context);
                return;
            }
            // make the checks for validity
            const valid = matrix.decompose(scaling, rotation, position);
            this.isValid.setValue(valid, context);
            this.position.setValue(position, context);
            this.rotationQuaternion.setValue(rotation, context);
            this.scaling.setValue(scaling, context);
            context._setExecutionVariable(this, "cachedPosition", position);
            context._setExecutionVariable(this, "cachedRotation", rotation);
            context._setExecutionVariable(this, "cachedScaling", scaling);
            context._setExecutionVariable(this, "executionId", context.executionId);
        }
    }
    getClassName() {
        return "FlowGraphMatrixDecompose" /* FlowGraphBlockNames.MatrixDecompose */;
    }
}
RegisterClass("FlowGraphMatrixDecompose" /* FlowGraphBlockNames.MatrixDecompose */, FlowGraphMatrixDecomposeBlock);
/**
 * Matrix compose block
 */
export class FlowGraphMatrixComposeBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.position = this.registerDataInput("position", RichTypeVector3);
        this.rotationQuaternion = this.registerDataInput("rotationQuaternion", RichTypeQuaternion);
        this.scaling = this.registerDataInput("scaling", RichTypeVector3);
        this.value = this.registerDataOutput("value", RichTypeMatrix);
    }
    _updateOutputs(context) {
        const cachedExecutionId = context._getExecutionVariable(this, "executionId", -1);
        const cachedMatrix = context._getExecutionVariable(this, "cachedMatrix", null);
        if (cachedExecutionId === context.executionId && cachedMatrix) {
            this.value.setValue(cachedMatrix, context);
        }
        else {
            const matrix = Matrix.Compose(this.scaling.getValue(context), this.rotationQuaternion.getValue(context), this.position.getValue(context));
            this.value.setValue(matrix, context);
            context._setExecutionVariable(this, "cachedMatrix", matrix);
            context._setExecutionVariable(this, "executionId", context.executionId);
        }
    }
    getClassName() {
        return "FlowGraphMatrixCompose" /* FlowGraphBlockNames.MatrixCompose */;
    }
}
RegisterClass("FlowGraphMatrixCompose" /* FlowGraphBlockNames.MatrixCompose */, FlowGraphMatrixComposeBlock);
//# sourceMappingURL=flowGraphMatrixMathBlocks.js.map