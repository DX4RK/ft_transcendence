/**
 * Any external module that wishes to add a new block to the flow graph can add to this object using the helper function.
 */
const CustomBlocks = {};
/**
 * If you want to add a new block to the block factory, you should use this function.
 * Please be sure to choose a unique name and define the responsible module.
 * @param module the name of the module that is responsible for the block
 * @param blockName the name of the block. This should be unique.
 * @param factory an async factory function to generate the block
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function addToBlockFactory(module, blockName, factory) {
    CustomBlocks[`${module}/${blockName}`] = factory;
}
/**
 * a function to get a factory function for a block.
 * @param blockName the block name to initialize. If the block comes from an external module, the name should be in the format "module/blockName"
 * @returns an async factory function that will return the block class when called.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function blockFactory(blockName) {
    switch (blockName) {
        case "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */:
            return async () => (await import("./Execution/Animation/flowGraphPlayAnimationBlock.js")).FlowGraphPlayAnimationBlock;
        case "FlowGraphStopAnimationBlock" /* FlowGraphBlockNames.StopAnimation */:
            return async () => (await import("./Execution/Animation/flowGraphStopAnimationBlock.js")).FlowGraphStopAnimationBlock;
        case "FlowGraphPauseAnimationBlock" /* FlowGraphBlockNames.PauseAnimation */:
            return async () => (await import("./Execution/Animation/flowGraphPauseAnimationBlock.js")).FlowGraphPauseAnimationBlock;
        case "FlowGraphInterpolationBlock" /* FlowGraphBlockNames.ValueInterpolation */:
            return async () => (await import("./Execution/Animation/flowGraphInterpolationBlock.js")).FlowGraphInterpolationBlock;
        case "FlowGraphSceneReadyEventBlock" /* FlowGraphBlockNames.SceneReadyEvent */:
            return async () => (await import("./Event/flowGraphSceneReadyEventBlock.js")).FlowGraphSceneReadyEventBlock;
        case "FlowGraphSceneTickEventBlock" /* FlowGraphBlockNames.SceneTickEvent */:
            return async () => (await import("./Event/flowGraphSceneTickEventBlock.js")).FlowGraphSceneTickEventBlock;
        case "FlowGraphSendCustomEventBlock" /* FlowGraphBlockNames.SendCustomEvent */:
            return async () => (await import("./Event/flowGraphSendCustomEventBlock.js")).FlowGraphSendCustomEventBlock;
        case "FlowGraphReceiveCustomEventBlock" /* FlowGraphBlockNames.ReceiveCustomEvent */:
            return async () => (await import("./Event/flowGraphReceiveCustomEventBlock.js")).FlowGraphReceiveCustomEventBlock;
        case "FlowGraphMeshPickEventBlock" /* FlowGraphBlockNames.MeshPickEvent */:
            return async () => (await import("./Event/flowGraphMeshPickEventBlock.js")).FlowGraphMeshPickEventBlock;
        case "FlowGraphEBlock" /* FlowGraphBlockNames.E */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphEBlock;
        case "FlowGraphPIBlock" /* FlowGraphBlockNames.PI */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphPiBlock;
        case "FlowGraphInfBlock" /* FlowGraphBlockNames.Inf */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphInfBlock;
        case "FlowGraphNaNBlock" /* FlowGraphBlockNames.NaN */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphNaNBlock;
        case "FlowGraphRandomBlock" /* FlowGraphBlockNames.Random */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphRandomBlock;
        case "FlowGraphAddBlock" /* FlowGraphBlockNames.Add */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAddBlock;
        case "FlowGraphSubtractBlock" /* FlowGraphBlockNames.Subtract */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphSubtractBlock;
        case "FlowGraphMultiplyBlock" /* FlowGraphBlockNames.Multiply */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphMultiplyBlock;
        case "FlowGraphDivideBlock" /* FlowGraphBlockNames.Divide */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphDivideBlock;
        case "FlowGraphAbsBlock" /* FlowGraphBlockNames.Abs */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAbsBlock;
        case "FlowGraphSignBlock" /* FlowGraphBlockNames.Sign */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphSignBlock;
        case "FlowGraphTruncBlock" /* FlowGraphBlockNames.Trunc */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphTruncBlock;
        case "FlowGraphFloorBlock" /* FlowGraphBlockNames.Floor */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphFloorBlock;
        case "FlowGraphCeilBlock" /* FlowGraphBlockNames.Ceil */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphCeilBlock;
        case "FlowGraphRoundBlock" /* FlowGraphBlockNames.Round */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphRoundBlock;
        case "FlowGraphFractBlock" /* FlowGraphBlockNames.Fraction */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphFractionBlock;
        case "FlowGraphNegationBlock" /* FlowGraphBlockNames.Negation */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphNegationBlock;
        case "FlowGraphModuloBlock" /* FlowGraphBlockNames.Modulo */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphModuloBlock;
        case "FlowGraphMinBlock" /* FlowGraphBlockNames.Min */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphMinBlock;
        case "FlowGraphMaxBlock" /* FlowGraphBlockNames.Max */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphMaxBlock;
        case "FlowGraphClampBlock" /* FlowGraphBlockNames.Clamp */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphClampBlock;
        case "FlowGraphSaturateBlock" /* FlowGraphBlockNames.Saturate */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphSaturateBlock;
        case "FlowGraphMathInterpolationBlock" /* FlowGraphBlockNames.MathInterpolation */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphMathInterpolationBlock;
        case "FlowGraphEqualityBlock" /* FlowGraphBlockNames.Equality */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphEqualityBlock;
        case "FlowGraphLessThanBlock" /* FlowGraphBlockNames.LessThan */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphLessThanBlock;
        case "FlowGraphLessThanOrEqualBlock" /* FlowGraphBlockNames.LessThanOrEqual */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphLessThanOrEqualBlock;
        case "FlowGraphGreaterThanBlock" /* FlowGraphBlockNames.GreaterThan */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphGreaterThanBlock;
        case "FlowGraphGreaterThanOrEqualBlock" /* FlowGraphBlockNames.GreaterThanOrEqual */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphGreaterThanOrEqualBlock;
        case "FlowGraphIsNaNBlock" /* FlowGraphBlockNames.IsNaN */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphIsNanBlock;
        case "FlowGraphIsInfBlock" /* FlowGraphBlockNames.IsInfinity */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphIsInfinityBlock;
        case "FlowGraphDegToRadBlock" /* FlowGraphBlockNames.DegToRad */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphDegToRadBlock;
        case "FlowGraphRadToDegBlock" /* FlowGraphBlockNames.RadToDeg */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphRadToDegBlock;
        case "FlowGraphSinBlock" /* FlowGraphBlockNames.Sin */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphSinBlock;
        case "FlowGraphCosBlock" /* FlowGraphBlockNames.Cos */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphCosBlock;
        case "FlowGraphTanBlock" /* FlowGraphBlockNames.Tan */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphTanBlock;
        case "FlowGraphASinBlock" /* FlowGraphBlockNames.Asin */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAsinBlock;
        case "FlowGraphACosBlock" /* FlowGraphBlockNames.Acos */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAcosBlock;
        case "FlowGraphATanBlock" /* FlowGraphBlockNames.Atan */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAtanBlock;
        case "FlowGraphATan2Block" /* FlowGraphBlockNames.Atan2 */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAtan2Block;
        case "FlowGraphSinhBlock" /* FlowGraphBlockNames.Sinh */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphSinhBlock;
        case "FlowGraphCoshBlock" /* FlowGraphBlockNames.Cosh */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphCoshBlock;
        case "FlowGraphTanhBlock" /* FlowGraphBlockNames.Tanh */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphTanhBlock;
        case "FlowGraphASinhBlock" /* FlowGraphBlockNames.Asinh */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAsinhBlock;
        case "FlowGraphACoshBlock" /* FlowGraphBlockNames.Acosh */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAcoshBlock;
        case "FlowGraphATanhBlock" /* FlowGraphBlockNames.Atanh */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphAtanhBlock;
        case "FlowGraphExponentialBlock" /* FlowGraphBlockNames.Exponential */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphExpBlock;
        case "FlowGraphLogBlock" /* FlowGraphBlockNames.Log */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphLogBlock;
        case "FlowGraphLog2Block" /* FlowGraphBlockNames.Log2 */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphLog2Block;
        case "FlowGraphLog10Block" /* FlowGraphBlockNames.Log10 */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphLog10Block;
        case "FlowGraphSquareRootBlock" /* FlowGraphBlockNames.SquareRoot */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphSquareRootBlock;
        case "FlowGraphPowerBlock" /* FlowGraphBlockNames.Power */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphPowerBlock;
        case "FlowGraphCubeRootBlock" /* FlowGraphBlockNames.CubeRoot */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphCubeRootBlock;
        case "FlowGraphBitwiseAndBlock" /* FlowGraphBlockNames.BitwiseAnd */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphBitwiseAndBlock;
        case "FlowGraphBitwiseOrBlock" /* FlowGraphBlockNames.BitwiseOr */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphBitwiseOrBlock;
        case "FlowGraphBitwiseNotBlock" /* FlowGraphBlockNames.BitwiseNot */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphBitwiseNotBlock;
        case "FlowGraphBitwiseXorBlock" /* FlowGraphBlockNames.BitwiseXor */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphBitwiseXorBlock;
        case "FlowGraphBitwiseLeftShiftBlock" /* FlowGraphBlockNames.BitwiseLeftShift */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphBitwiseLeftShiftBlock;
        case "FlowGraphBitwiseRightShiftBlock" /* FlowGraphBlockNames.BitwiseRightShift */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphBitwiseRightShiftBlock;
        case "FlowGraphLengthBlock" /* FlowGraphBlockNames.Length */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphLengthBlock;
        case "FlowGraphNormalizeBlock" /* FlowGraphBlockNames.Normalize */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphNormalizeBlock;
        case "FlowGraphDotBlock" /* FlowGraphBlockNames.Dot */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphDotBlock;
        case "FlowGraphCrossBlock" /* FlowGraphBlockNames.Cross */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphCrossBlock;
        case "FlowGraphRotate2DBlock" /* FlowGraphBlockNames.Rotate2D */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphRotate2DBlock;
        case "FlowGraphRotate3DBlock" /* FlowGraphBlockNames.Rotate3D */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphRotate3DBlock;
        case "FlowGraphTransposeBlock" /* FlowGraphBlockNames.Transpose */:
            return async () => (await import("./Data/Math/flowGraphMatrixMathBlocks.js")).FlowGraphTransposeBlock;
        case "FlowGraphDeterminantBlock" /* FlowGraphBlockNames.Determinant */:
            return async () => (await import("./Data/Math/flowGraphMatrixMathBlocks.js")).FlowGraphDeterminantBlock;
        case "FlowGraphInvertMatrixBlock" /* FlowGraphBlockNames.InvertMatrix */:
            return async () => (await import("./Data/Math/flowGraphMatrixMathBlocks.js")).FlowGraphInvertMatrixBlock;
        case "FlowGraphMatrixMultiplicationBlock" /* FlowGraphBlockNames.MatrixMultiplication */:
            return async () => (await import("./Data/Math/flowGraphMatrixMathBlocks.js")).FlowGraphMatrixMultiplicationBlock;
        case "FlowGraphBranchBlock" /* FlowGraphBlockNames.Branch */:
            return async () => (await import("./Execution/ControlFlow/flowGraphBranchBlock.js")).FlowGraphBranchBlock;
        case "FlowGraphSetDelayBlock" /* FlowGraphBlockNames.SetDelay */:
            return async () => (await import("./Execution/ControlFlow/flowGraphSetDelayBlock.js")).FlowGraphSetDelayBlock;
        case "FlowGraphCancelDelayBlock" /* FlowGraphBlockNames.CancelDelay */:
            return async () => (await import("./Execution/ControlFlow/flowGraphCancelDelayBlock.js")).FlowGraphCancelDelayBlock;
        case "FlowGraphCallCounterBlock" /* FlowGraphBlockNames.CallCounter */:
            return async () => (await import("./Execution/ControlFlow/flowGraphCounterBlock.js")).FlowGraphCallCounterBlock;
        case "FlowGraphDebounceBlock" /* FlowGraphBlockNames.Debounce */:
            return async () => (await import("./Execution/ControlFlow/flowGraphDebounceBlock.js")).FlowGraphDebounceBlock;
        case "FlowGraphThrottleBlock" /* FlowGraphBlockNames.Throttle */:
            return async () => (await import("./Execution/ControlFlow/flowGraphThrottleBlock.js")).FlowGraphThrottleBlock;
        case "FlowGraphDoNBlock" /* FlowGraphBlockNames.DoN */:
            return async () => (await import("./Execution/ControlFlow/flowGraphDoNBlock.js")).FlowGraphDoNBlock;
        case "FlowGraphFlipFlopBlock" /* FlowGraphBlockNames.FlipFlop */:
            return async () => (await import("./Execution/ControlFlow/flowGraphFlipFlopBlock.js")).FlowGraphFlipFlopBlock;
        case "FlowGraphForLoopBlock" /* FlowGraphBlockNames.ForLoop */:
            return async () => (await import("./Execution/ControlFlow/flowGraphForLoopBlock.js")).FlowGraphForLoopBlock;
        case "FlowGraphMultiGateBlock" /* FlowGraphBlockNames.MultiGate */:
            return async () => (await import("./Execution/ControlFlow/flowGraphMultiGateBlock.js")).FlowGraphMultiGateBlock;
        case "FlowGraphSequenceBlock" /* FlowGraphBlockNames.Sequence */:
            return async () => (await import("./Execution/ControlFlow/flowGraphSequenceBlock.js")).FlowGraphSequenceBlock;
        case "FlowGraphSwitchBlock" /* FlowGraphBlockNames.Switch */:
            return async () => (await import("./Execution/ControlFlow/flowGraphSwitchBlock.js")).FlowGraphSwitchBlock;
        case "FlowGraphWaitAllBlock" /* FlowGraphBlockNames.WaitAll */:
            return async () => (await import("./Execution/ControlFlow/flowGraphWaitAllBlock.js")).FlowGraphWaitAllBlock;
        case "FlowGraphWhileLoopBlock" /* FlowGraphBlockNames.WhileLoop */:
            return async () => (await import("./Execution/ControlFlow/flowGraphWhileLoopBlock.js")).FlowGraphWhileLoopBlock;
        case "FlowGraphConsoleLogBlock" /* FlowGraphBlockNames.ConsoleLog */:
            return async () => (await import("./Execution/flowGraphConsoleLogBlock.js")).FlowGraphConsoleLogBlock;
        case "FlowGraphConditionalBlock" /* FlowGraphBlockNames.Conditional */:
            return async () => (await import("./Data/flowGraphConditionalDataBlock.js")).FlowGraphConditionalDataBlock;
        case "FlowGraphConstantBlock" /* FlowGraphBlockNames.Constant */:
            return async () => (await import("./Data/flowGraphConstantBlock.js")).FlowGraphConstantBlock;
        case "FlowGraphTransformCoordinatesSystemBlock" /* FlowGraphBlockNames.TransformCoordinatesSystem */:
            return async () => (await import("./Data/flowGraphTransformCoordinatesSystemBlock.js")).FlowGraphTransformCoordinatesSystemBlock;
        case "FlowGraphGetAssetBlock" /* FlowGraphBlockNames.GetAsset */:
            return async () => (await import("./Data/flowGraphGetAssetBlock.js")).FlowGraphGetAssetBlock;
        case "FlowGraphGetPropertyBlock" /* FlowGraphBlockNames.GetProperty */:
            return async () => (await import("./Data/flowGraphGetPropertyBlock.js")).FlowGraphGetPropertyBlock;
        case "FlowGraphSetPropertyBlock" /* FlowGraphBlockNames.SetProperty */:
            return async () => (await import("./Execution/flowGraphSetPropertyBlock.js")).FlowGraphSetPropertyBlock;
        case "FlowGraphGetVariableBlock" /* FlowGraphBlockNames.GetVariable */:
            return async () => (await import("./Data/flowGraphGetVariableBlock.js")).FlowGraphGetVariableBlock;
        case "FlowGraphSetVariableBlock" /* FlowGraphBlockNames.SetVariable */:
            return async () => (await import("./Execution/flowGraphSetVariableBlock.js")).FlowGraphSetVariableBlock;
        case "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */:
            return async () => (await import("./Data/Transformers/flowGraphJsonPointerParserBlock.js")).FlowGraphJsonPointerParserBlock;
        case "FlowGraphLeadingZerosBlock" /* FlowGraphBlockNames.LeadingZeros */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphLeadingZerosBlock;
        case "FlowGraphTrailingZerosBlock" /* FlowGraphBlockNames.TrailingZeros */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphTrailingZerosBlock;
        case "FlowGraphOneBitsCounterBlock" /* FlowGraphBlockNames.OneBitsCounter */:
            return async () => (await import("./Data/Math/flowGraphMathBlocks.js")).FlowGraphOneBitsCounterBlock;
        case "FlowGraphCombineVector2Block" /* FlowGraphBlockNames.CombineVector2 */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphCombineVector2Block;
        case "FlowGraphCombineVector3Block" /* FlowGraphBlockNames.CombineVector3 */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphCombineVector3Block;
        case "FlowGraphCombineVector4Block" /* FlowGraphBlockNames.CombineVector4 */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphCombineVector4Block;
        case "FlowGraphCombineMatrixBlock" /* FlowGraphBlockNames.CombineMatrix */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphCombineMatrixBlock;
        case "FlowGraphExtractVector2Block" /* FlowGraphBlockNames.ExtractVector2 */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphExtractVector2Block;
        case "FlowGraphExtractVector3Block" /* FlowGraphBlockNames.ExtractVector3 */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphExtractVector3Block;
        case "FlowGraphExtractVector4Block" /* FlowGraphBlockNames.ExtractVector4 */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphExtractVector4Block;
        case "FlowGraphExtractMatrixBlock" /* FlowGraphBlockNames.ExtractMatrix */:
            return async () => (await import("./Data/Math/flowGraphMathCombineExtractBlocks.js")).FlowGraphExtractMatrixBlock;
        case "FlowGraphTransformVectorBlock" /* FlowGraphBlockNames.TransformVector */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphTransformBlock;
        case "FlowGraphTransformCoordinatesBlock" /* FlowGraphBlockNames.TransformCoordinates */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphTransformCoordinatesBlock;
        case "FlowGraphConjugateBlock" /* FlowGraphBlockNames.Conjugate */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphConjugateBlock;
        case "FlowGraphAngleBetweenBlock" /* FlowGraphBlockNames.AngleBetween */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphAngleBetweenBlock;
        case "FlowGraphQuaternionFromAxisAngleBlock" /* FlowGraphBlockNames.QuaternionFromAxisAngle */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphQuaternionFromAxisAngleBlock;
        case "FlowGraphAxisAngleFromQuaternionBlock" /* FlowGraphBlockNames.AxisAngleFromQuaternion */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphAxisAngleFromQuaternionBlock;
        case "FlowGraphQuaternionFromDirectionsBlock" /* FlowGraphBlockNames.QuaternionFromDirections */:
            return async () => (await import("./Data/Math/flowGraphVectorMathBlocks.js")).FlowGraphQuaternionFromDirectionsBlock;
        case "FlowGraphMatrixDecompose" /* FlowGraphBlockNames.MatrixDecompose */:
            return async () => (await import("./Data/Math/flowGraphMatrixMathBlocks.js")).FlowGraphMatrixDecomposeBlock;
        case "FlowGraphMatrixCompose" /* FlowGraphBlockNames.MatrixCompose */:
            return async () => (await import("./Data/Math/flowGraphMatrixMathBlocks.js")).FlowGraphMatrixComposeBlock;
        case "FlowGraphBooleanToFloat" /* FlowGraphBlockNames.BooleanToFloat */:
            return async () => (await import("./Data/Transformers/flowGraphTypeToTypeBlocks.js")).FlowGraphBooleanToFloat;
        case "FlowGraphBooleanToInt" /* FlowGraphBlockNames.BooleanToInt */:
            return async () => (await import("./Data/Transformers/flowGraphTypeToTypeBlocks.js")).FlowGraphBooleanToInt;
        case "FlowGraphFloatToBoolean" /* FlowGraphBlockNames.FloatToBoolean */:
            return async () => (await import("./Data/Transformers/flowGraphTypeToTypeBlocks.js")).FlowGraphFloatToBoolean;
        case "FlowGraphIntToBoolean" /* FlowGraphBlockNames.IntToBoolean */:
            return async () => (await import("./Data/Transformers/flowGraphTypeToTypeBlocks.js")).FlowGraphIntToBoolean;
        case "FlowGraphIntToFloat" /* FlowGraphBlockNames.IntToFloat */:
            return async () => (await import("./Data/Transformers/flowGraphTypeToTypeBlocks.js")).FlowGraphIntToFloat;
        case "FlowGraphFloatToInt" /* FlowGraphBlockNames.FloatToInt */:
            return async () => (await import("./Data/Transformers/flowGraphTypeToTypeBlocks.js")).FlowGraphFloatToInt;
        case "FlowGraphEasingBlock" /* FlowGraphBlockNames.Easing */:
            return async () => (await import("./Execution/Animation/flowGraphEasingBlock.js")).FlowGraphEasingBlock;
        case "FlowGraphBezierCurveEasing" /* FlowGraphBlockNames.BezierCurveEasing */:
            return async () => (await import("./Execution/Animation/flowGraphBezierCurveEasingBlock.js")).FlowGraphBezierCurveEasingBlock;
        case "FlowGraphPointerOverEventBlock" /* FlowGraphBlockNames.PointerOverEvent */:
            return async () => (await import("./Event/flowGraphPointerOverEventBlock.js")).FlowGraphPointerOverEventBlock;
        case "FlowGraphPointerOutEventBlock" /* FlowGraphBlockNames.PointerOutEvent */:
            return async () => (await import("./Event/flowGraphPointerOutEventBlock.js")).FlowGraphPointerOutEventBlock;
        case "FlowGraphContextBlock" /* FlowGraphBlockNames.Context */:
            return async () => (await import("./Data/Utils/flowGraphContextBlock.js")).FlowGraphContextBlock;
        case "FlowGraphArrayIndexBlock" /* FlowGraphBlockNames.ArrayIndex */:
            return async () => (await import("./Data/Utils/flowGraphArrayIndexBlock.js")).FlowGraphArrayIndexBlock;
        case "FlowGraphCodeExecutionBlock" /* FlowGraphBlockNames.CodeExecution */:
            return async () => (await import("./Data/Utils/flowGraphCodeExecutionBlock.js")).FlowGraphCodeExecutionBlock;
        case "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */:
            return async () => (await import("./Data/Utils/flowGraphIndexOfBlock.js")).FlowGraphIndexOfBlock;
        case "FlowGraphFunctionReference" /* FlowGraphBlockNames.FunctionReference */:
            return async () => (await import("./Data/Utils/flowGraphFunctionReferenceBlock.js")).FlowGraphFunctionReferenceBlock;
        case "FlowGraphDataSwitchBlock" /* FlowGraphBlockNames.DataSwitch */:
            return async () => (await import("./Data/flowGraphDataSwitchBlock.js")).FlowGraphDataSwitchBlock;
        default:
            // check if the block is a custom block
            if (CustomBlocks[blockName]) {
                return CustomBlocks[blockName];
            }
            throw new Error(`Unknown block name ${blockName}`);
    }
}
//# sourceMappingURL=flowGraphBlockFactory.js.map