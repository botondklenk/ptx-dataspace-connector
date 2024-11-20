/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Evaluation } from '../models/Evaluation';
import type { EvaluationStatus } from '../models/EvaluationStatus';
import type { VLA } from '../models/VLA';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EvaluationService {
    /**
     * Get all evaluations
     * @returns Evaluation Successful response
     * @throws ApiError
     */
    public static getEvaluation(): CancelablePromise<Array<Evaluation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/evaluation',
        });
    }
    /**
     * Get evaluation by ID
     * @param exchangeId
     * @returns Evaluation Successful response
     * @throws ApiError
     */
    public static getEvaluation1(
        exchangeId: string,
    ): CancelablePromise<Evaluation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/evaluation/{exchangeId}',
            path: {
                'exchangeId': exchangeId,
            },
        });
    }
    /**
     * Start evaluation with given ID
     * @param exchangeId
     * @param requestBody
     * @returns Evaluation Successful response
     * @throws ApiError
     */
    public static startEvaluation(
        exchangeId: string,
        requestBody: {
            vla: VLA;
        },
    ): CancelablePromise<Evaluation> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/evaluation/{exchangeId}',
            path: {
                'exchangeId': exchangeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Evaluate data
     * @param exchangeId
     * @param requestBody
     * @returns any Evaluation successful
     * @throws ApiError
     */
    public static evaluateData(
        exchangeId: string,
        requestBody: {
            resourceId: string;
            data: Array<Record<string, any>>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/evaluation/{exchangeId}/evaluate',
            path: {
                'exchangeId': exchangeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Abort or finish evaluation
     * @param exchangeId
     * @param requestBody
     * @returns any Status updated
     * @throws ApiError
     */
    public static stopEvaluation(
        exchangeId: string,
        requestBody: {
            status: EvaluationStatus;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/evaluation/{exchangeId}/status',
            path: {
                'exchangeId': exchangeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
