import axios from 'axios';
import { urlChecker } from '../../utils/urlChecker';

export const consumerImport = async (
    endpoint: string,
    dataExchangeId: string,
    resourceId: string,
    data: any,
    apiResponseRepresentation?: any
) => {
    return axios.post(urlChecker(endpoint, 'consumer/import'), {
        providerDataExchange: dataExchangeId,
        resourceId,
        data,
        apiResponseRepresentation,
    });
};
