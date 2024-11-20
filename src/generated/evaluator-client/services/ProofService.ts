/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Proof } from '../models/Proof';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProofService {
    /**
     * Get all proofs
     * @returns Proof Successful response
     * @throws ApiError
     */
    public static getProofs(): CancelablePromise<Array<Proof>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/proof',
        });
    }
    /**
     * Get proof by ID
     * @param exchangeId
     * @returns Proof Successful response
     * @throws ApiError
     */
    public static getProof(
        exchangeId: string,
    ): CancelablePromise<Proof> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/proof/{exchangeId}',
            path: {
                'exchangeId': exchangeId,
            },
        });
    }
}
