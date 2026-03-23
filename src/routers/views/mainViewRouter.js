/*****************************************************************************/
/* MAIN VIEW ROUTER: ROUTES APP ROOT AND HOME VIEW HTML                      */
/*****************************************************************************/

/* External module imports */
import {Router} from 'express';
import {authCheck, getAuthUserDisplayName} from '../rest/authRouter.js';


/*****************************************************************************/

export function createMainViewRouter(version = '') {
  const versionText = version === '' ? version : ` (v.${version})`;

  return new Router()
    .get('/', authCheck({failureRedirects: '/login'}), renderArtikkelit)
    .get('/login', authCheck({successRedirects: '/', allowUnauthorized: true}), renderLogin)

  function renderArtikkelit(req, res) {
    const renderedView = 'artikkelit';
    const displayName = getAuthUserDisplayName(req);
    const localVariable = {title: `Artikkelit${versionText}`, username: displayName, onload: 'initialize()', version};

    return res.render(renderedView, localVariable);
  }

  function renderLogin(req, res) {
    const renderedView = 'loginpage';
    const localVariable = {title: `Artikkelit${versionText} | kirjautuminen`, isLogin: true, onload: 'initialize()', version};
    return res.render(renderedView, localVariable);
  }
}
