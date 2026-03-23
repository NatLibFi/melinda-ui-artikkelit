import express from 'express';
import {engine} from 'express-handlebars';
import path from 'path';

import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {AlephStrategy} from '@natlibfi/passport-melinda-aleph';
import {MelindaJwtStrategy, verify, cookieExtractor} from '@natlibfi/passport-melinda-jwt';

import {createExpressLogger} from '@natlibfi/melinda-backend-commons';
import {appLogger, handleAppError, handleAppPageNotFound} from './middlewares.js';
import {createAuthRouter, createBibRouter, createMainViewRouter, createOntologyRouter, createRecordRouter, createStatusRouter} from './routers/routers.js';

//const dirname = __dirname; // import.meta.dirname;
const dirname = import.meta.dirname;

//////////////////////////////////////////////////////////////////
// The function startApp creates server and returns it.
// The parameter is a set of environment variables

export async function startApp(configOptions) {

  const {httpPort, enableProxy, fintoApiOptions, melindaApiOptions, sharedLocationOptions, sruApiOptions, authAlephOptions, authJwtOptions, version} = configOptions;

  console.log(`VERSION: ${version}`);

  const server = await initExpress();

  return server;

  //////////////////////////////////////////////////////////////////


  //----------------------------------------------------//
  // Defining the Express server

  // Add async when you need await in route construction
  async function initExpress() {

    //---------------------------------------------------//
    // Set the application as an Express app (function)

    const app = express();
    app.enable('trust proxy', enableProxy);

    //---------------------------------------------------//
    // enable cors

    app.use(cors());

    //---------------------------------------------------//
    // enable cookie parser

    app.use(cookieParser());

    //---------------------------------------------------//
    // configure passport strategies for authentication

    //login via auth header with token created from username and password
    //strategy name 'melinda'
    //token generation and auth usage in authRouter.js
    passport.use(new AlephStrategy(authAlephOptions));

    //strategy name 'jwt'
    //autheticate via 'melinda' named cookie with jwt token
    passport.use(new MelindaJwtStrategy({
      ...authJwtOptions,
      secretOrKey: authJwtOptions.secretOrPrivateKey,
      jwtFromRequest: cookieExtractor
    }, verify));

    app.use(passport.initialize());


    //---------------------------------------------------//
    // Setup Express Handlebars view engine

    const {sharedPartialsLocation, sharedPublicLocation, sharedViewsLocation} = sharedLocationOptions;

    const handlebarsOptions = {
      extname: '.hbs',
      defaultLayout: 'default',
      layoutsDir: path.join(dirname, 'views/layouts'),
      partialsDir: [
        {dir: path.join(dirname, 'views/partials'), namespace: 'localPartials'},
        {dir: path.join(dirname, sharedPartialsLocation), namespace: 'sharedPartials'}
      ],
      helpers: {
        shared(param) {
          return param.startsWith('/')
            ? `/shared${param}`
            : `sharedPartials/${param}`;
        }
      }
    };

    app.engine('.hbs', engine(handlebarsOptions));

    app.set('view engine', '.hbs');

    app.set('views', [
      path.join(dirname, 'views'),
      path.join(dirname, sharedViewsLocation)
    ]);


    //---------------------------------------------------//
    // Setup Express logger

    app.use(createExpressLogger());


    //---------------------------------------------------//
    // Setup Express built-in middleware function 'express.urlencoded'
    // Parses requests with urlencoded body
    // option extended is set as false:
    //    data is parsed with querystring library

    app.use(express.urlencoded({extended: false}));


    //---------------------------------------------------//
    // Setup Express built-in middleware function 'express.json'
    //  Parses requests with JSON payload

    app.use(express.json());


    //---------------------------------------------------//
    // Setup Express built-in middleware function 'express.static'
    // The directory where static assets are served from is given as argument.

    app.use('/shared', express.static(path.join(dirname, sharedPublicLocation)));
    app.use('/scripts', express.static(path.join(dirname, 'scripts')));
    app.use('/styles', express.static(path.join(dirname, 'styles')));


    //---------------------------------------------------//
    // Setup Express Routers for these defined routes
    //   - require authentication to all but status route

    app.use('/', createMainViewRouter(version));
    app.use('/status', createStatusRouter());

    //catch /logout call and forward to auth router
    app.use('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
      res.redirect('/rest/auth/logout');
    });
    app.use('/rest/auth', createAuthRouter(authJwtOptions)); // authentication, not authority
    app.use('/rest/bib', passport.authenticate('jwt', {session: false}), await createBibRouter(sruApiOptions));
    app.use('/rest/ontology', createOntologyRouter(fintoApiOptions, sruApiOptions));
    app.use('/rest/record', passport.authenticate('jwt', {session: false}), createRecordRouter(melindaApiOptions));

    //---------------------------------------------------//
    // Setup handling for all other routes
    // When page is not found:
    //    -catch 404 and forward to error handler

    app.use(handleAppPageNotFound);


    //---------------------------------------------------//
    // Setup Express error handler for app errors

    app.use(handleAppError);


    //----------------------------------------------------//
    // Setup server to listen for connections on the specified port

    return app.listen(httpPort, appLogger.log('info', `Started Melinda Artikkelit in port ${httpPort}`));

  }
}
