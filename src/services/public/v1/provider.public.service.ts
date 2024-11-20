import { DataExchange } from '../../../utils/types/dataExchange';
import { handle } from '../../../libs/loaders/handler';
import { getContract } from '../../../libs/services/contract';
import { selfDescriptionProcessor } from '../../../utils/selfDescriptionProcessor';
import {
    pepLeftOperandsVerification,
    pepVerification,
} from '../../../utils/pepVerification';
import { getCatalogData } from '../../../libs/services/catalog';
import { consumerError } from '../../../utils/consumerError';
import { Regexes } from '../../../utils/regexes';
import { getRepresentation } from '../../../libs/loaders/representationFetcher';
import { DataExchangeStatusEnum } from '../../../utils/enums/dataExchangeStatusEnum';
import { consumerImport } from '../../../libs/services/consumer';
import { processLeftOperands } from '../../../utils/leftOperandProcessor';
import { Logger } from '../../../libs/loggers';
import { getCatalogUri } from '../../../libs/loaders/configuration';
import {
    EvaluationService,
    EvaluationStatus,
} from '../../../generated/evaluator-client';

export const ProviderExportService = async (consumerDataExchange: string) => {
    //Get the data exchange
    const dataExchange = await DataExchange.findOne({
        consumerDataExchange: consumerDataExchange,
    });

    try {
        // Get the contract
        const [contractResp] = await handle(getContract(dataExchange.contract));
        const vla = contractResp.vla;
        await EvaluationService.startEvaluation(
            dataExchange.consumerDataExchange,
            {
                vla,
            }
        );

        const serviceOffering = selfDescriptionProcessor(
            dataExchange.resources[0].serviceOffering,
            dataExchange,
            dataExchange.contract,
            contractResp
        );

        //PEP
        // const { pep, contractID, resourceID } = await pepVerification({
        //     targetResource: serviceOffering,
        //     referenceURL: dataExchange.contract,
        // });

        if (true) {
            for (const resource of dataExchange.resources) {
                const resourceSD = resource.resource;
                const resourceUrl =
                    (await getCatalogUri()) + 'dataresources/' + resourceSD;

                // B to B exchange
                if (
                    dataExchange._id &&
                    dataExchange.consumerEndpoint &&
                    resourceSD
                ) {
                    //Call the catalog endpoint
                    const [endpointData, endpointDataError] = await handle(
                        getCatalogData(resourceUrl)
                    );

                    if (!endpointData?.representation) {
                        await consumerError(
                            dataExchange.consumerEndpoint,
                            dataExchange._id.toString(),
                            'No representation found'
                        );
                    }

                    let data;
                    if (
                        !endpointData?.representation?.url.match(
                            Regexes.urlParams
                        )
                    ) {
                        switch ('REST') {
                            case 'REST':
                                // eslint-disable-next-line no-case-declarations
                                const [getProviderData, getProviderDataError] =
                                    await handle(
                                        getRepresentation({
                                            resource: resourceSD,
                                            method: endpointData?.representation
                                                ?.method,
                                            endpoint:
                                                endpointData?.representation
                                                    ?.url,
                                            credential:
                                                endpointData?.representation
                                                    ?.credential,
                                            representationQueryParams:
                                                endpointData?.representation
                                                    ?.queryParams,
                                            dataExchange,
                                        })
                                    );

                                data = getProviderData;
                                break;
                        }
                    }

                    if (!data) {
                        await dataExchange.updateStatus(
                            DataExchangeStatusEnum.PROVIDER_EXPORT_ERROR,
                            'No data found'
                        );
                    }

                    await EvaluationService.evaluateData(
                        dataExchange.consumerDataExchange,
                        {
                            resourceId: resourceSD,
                            data,
                        }
                    );

                    try {
                        //Send the data to generic endpoint
                        const [consumerImportRes] = await handle(
                            consumerImport(
                                dataExchange.consumerEndpoint,
                                dataExchange._id.toString(),
                                resourceSD,
                                data,
                                endpointData?.apiResponseRepresentation
                            )
                        );

                        // if (consumerImportRes) {
                        //     const names = await pepLeftOperandsVerification({
                        //         targetResource: serviceOffering,
                        //         referenceURL: dataExchange.contract,
                        //     });
                        //     await processLeftOperands(
                        //         names,
                        //         contractID,
                        //         resourceID
                        //     );
                        // }
                    } catch (e) {
                        Logger.error({
                            message: e.message,
                            location: e.stack,
                        });
                    }
                }
            }

            await EvaluationService.stopEvaluation(
                dataExchange.consumerDataExchange,
                {
                    status: EvaluationStatus.FINISHED,
                }
            );

            return true;
        } else {
            await dataExchange.updateStatus(DataExchangeStatusEnum.PEP_ERROR);
        }
    } catch (e) {
        Logger.error({
            message: e.message,
            location: e.stack,
        });

        await EvaluationService.stopEvaluation(
            dataExchange.consumerDataExchange,
            {
                status: EvaluationStatus.ABORTED,
            }
        );

        await dataExchange.updateStatus(
            DataExchangeStatusEnum.PROVIDER_EXPORT_ERROR,
            e.message
        );
    }
};
