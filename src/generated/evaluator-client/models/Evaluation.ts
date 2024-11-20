/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EvaluationResult } from './EvaluationResult';
import type { EvaluationStatus } from './EvaluationStatus';
import type { VLA } from './VLA';
export type Evaluation = {
    exchangeId: string;
    status: EvaluationStatus;
    vla: VLA;
    result: EvaluationResult;
};

