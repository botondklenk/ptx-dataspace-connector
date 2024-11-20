/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataType } from './DataType';
import type { Objective } from './Objective';
export type VLA = {
    meta: {
        description?: string;
        provider: string;
        consumer: string;
        dataType: DataType;
        status?: string;
        timestamp?: string;
    };
    objectives: Array<Objective>;
};

