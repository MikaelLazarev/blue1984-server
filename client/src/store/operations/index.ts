import {STATUS} from "../../utils/status";

export interface Operation {
    id: string,
    status: STATUS,
    error?: string,
}

export const namespace = 'operations';
export const OPERATION_PREFIX = 'OPERATIONS@@';
