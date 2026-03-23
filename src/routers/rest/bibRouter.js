import {Router} from 'express';
import {createLogger} from '@natlibfi/melinda-backend-commons';
import {createBibService} from '../../services/services.js';
import {handleError, handleFailedRouteParams, handleFailedQueryParams} from '../routerUtils/routerUtils.js';

export function createBibRouter(sruApiOptions) {
  const {sruApiUrl} = sruApiOptions
  const bibService = createBibService(sruApiUrl);
  const logger = createLogger();


  return new Router()
    .use(handleFailedQueryParams)
    .get('/:id', handleFailedRouteParams, fetchByMelindaId)
    .get('/isbn/:isbn', handleFailedRouteParams, fetchByIsbn)
    .get('/issn/:issn', handleFailedRouteParams, fetchByIssn)
    .get('/title/:title', handleFailedRouteParams, fetchByTitle)
    .use(handleError);

  //---------------------------------------------------------------------------

  async function fetchByMelindaId(req, res, next) {
    logger.info('GET publications by Melinda ID');
    const {id} = req.params;
    const {arto, fennica, melinda, type, ...rest} = req.query;
    const collectionQueryParams = {arto, fennica, melinda};
    const typeParam = type;
    const additionalQueryParams = rest;

    logger.verbose(`Fetching ${typeParam} with Melinda-ID '${id}`);
    logger.verbose(`Fetching using collection parameters ${JSON.stringify(collectionQueryParams)}`);
    logger.verbose(Object.keys(additionalQueryParams).length > 0 ? `Fetching with these additional query parameters: ${JSON.stringify(additionalQueryParams)}` : `No additional query parameters added for fetching`);

    try {
      const result = await bibService.getRecordById(id, typeParam, collectionQueryParams, additionalQueryParams);
      res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async function fetchByIsbn(req, res, next) {
    logger.info('GET publications by ISBN');

    const {isbn} = req.params;
    const {arto, fennica, melinda, type, ...rest} = req.query;
    const collectionQueryParams = {arto, fennica, melinda};
    const typeParam = type;
    const additionalQueryParams = rest;

    logger.verbose(`Fetching ${typeParam} with ISBN '${isbn}'`);
    logger.verbose(`Fetching using collection parameters ${JSON.stringify(collectionQueryParams)}`);
    logger.verbose(Object.keys(additionalQueryParams).length > 0 ? `Fetching with these additional query parameters: ${JSON.stringify(additionalQueryParams)}` : `No additional query parameters added for fetching`);

    try {
      const result = await bibService.getRecordByIsbn(isbn, typeParam, collectionQueryParams, additionalQueryParams);
      res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async function fetchByIssn(req, res, next) {
    logger.info('GET publications by ISSN');

    const {issn} = req.params;
    const {arto, fennica, melinda, type, ...rest} = req.query;
    const collectionQueryParams = {arto, fennica, melinda};
    const typeParam = type;
    const additionalQueryParams = rest;

    logger.verbose(`Fetching ${typeParam} with ISSN '${issn}'`);
    logger.verbose(`Fetching using collection parameters ${JSON.stringify(collectionQueryParams)}`);
    logger.verbose(Object.keys(additionalQueryParams).length > 0 ? `Fetching with these additional query parameters: ${JSON.stringify(additionalQueryParams)}` : `No additional query parameters added for fetching`);

    try {
      const result = await bibService.getRecordByIssn(issn, typeParam, collectionQueryParams, additionalQueryParams);
      res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async function fetchByTitle(req, res, next) {
    logger.info('GET publications by title');

    const {title} = req.params;
    const {arto, fennica, melinda, type, ...rest} = req.query;
    const collectionQueryParams = {arto, fennica, melinda};
    const typeParam = type;
    const additionalQueryParams = rest;

    logger.verbose(`Fetching ${typeParam} with title '${title}'`);
    logger.verbose(`Fetching using collection parameters ${JSON.stringify(collectionQueryParams)}`);
    logger.verbose(Object.keys(additionalQueryParams).length > 0 ? `Fetching with these additional query parameters: ${JSON.stringify(additionalQueryParams)}` : `No additional query parameters added for fetching`);

    try {
      const result = await bibService.getRecordByTitle(title, typeParam, collectionQueryParams, additionalQueryParams);
      res.json(result);
    } catch (error) {
      return next(error);
    }
  }

}
