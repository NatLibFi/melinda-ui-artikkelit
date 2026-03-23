/*****************************************************************************/
/*                                                                           */
/* Record generation, addition and validation for UI                         */
/*                                                                           */
/*****************************************************************************/
// NB! can this file be shared with melinda-ui-cyrillux? This fiel is pretty much a subset...

import bodyParser from 'body-parser';
// import express, {Router} from 'express';
import {Router} from 'express';
import {createLogger} from '@natlibfi/melinda-backend-commons';
import {createMelindaApiService, createMarcRecordService} from '../../services/services.js';
import {handleError, handleFailedQueryParams, handleFailedRouteParams} from '../routerUtils/routerUtils.js';


export function createRecordRouter(melindaApiOptions) {
  const logger = createLogger();
  const recordGeneratorService = createMarcRecordService();
  const melindaApiService = createMelindaApiService(melindaApiOptions);

  const bodyParserHelper = bodyParser.text({limit: '5MB', type: '*/*'})


  return new Router(melindaApiOptions)
    .use(handleFailedQueryParams)
    .post('/generate', handleFailedRouteParams, bodyParserHelper, generateRecord) // Artikkelit-only
    // .use(express.json()) // NV: No idea what this is... Cyrillux does not have this... Might even be my leftover crap...
    .post('/add', handleFailedRouteParams, addRecord)
    .post('/update/:id', handleFailedRouteParams, updateRecord)
    .post('/validate', handleFailedRouteParams, validateRecord)
    .use(handleError);


  function generateRecord(req, res, next) {
    try {
      const data = JSON.parse(req.body);
      const record = recordGeneratorService.generateRecord(data);
      logger.verbose(`Publication generated: ${JSON.stringify(record)}`);
      res.json({record});
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async function addRecord(req, res, next) {
    logger.info('POST article record: addition');

    const record = req.body;
    const cataloger = req.user.id;

    logger.verbose(`Adding article record with cataloger ${cataloger}: ${JSON.stringify(record)}`);

    try {
      //placeholders for testing:
      //await res.sendStatus(httpStatus.CREATED);
      //await res.sendStatus(httpStatus.CONFLICT);

      const result = await melindaApiService.addRecord(record, cataloger);
      res.json(result);
    } catch (error) {
      return next(error);
    }

  }

  async function validateRecord(req, res, next) {
    logger.info('POST article record: validation only');

    const record = req.body;

    logger.verbose(`Validating article record: ${JSON.stringify(record)}`);

    try {
      //placeholders for testing:
      //await res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
      //await res.sendStatus(httpStatus.OK);
      //await res.sendStatus(httpStatus.CONFLICT);


      const result = await melindaApiService.validateRecord(record);
      res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async function updateRecord(req, res, next) {
    logger.info('POST: updateRecord');

    const {id} = req.params;
    const record = req.body;
    const cataloger = req.user.id;

    logger.verbose(`Updating article record with Melinda ID ${id} and cataloger ${cataloger}: ${JSON.stringify(record)}`);

    try {
      const result = await melindaApiService.updateRecord(id, record, cataloger);
      res.json(result);
    } catch (error) {
      return next(error);
    }

  }
}
