/*****************************************************************************/
/* ON LOAD FUNCTION FOR ARTICLE                                              */
/*****************************************************************************/


/* Local imports */
import {initArticleForm} from '/scripts/actions/articleInitialize.mjs';
import {idbClearAll} from '/scripts/indexedDB.mjs';

import {
  addTabsEventListeners, clearAllTabSelections, hideAllPanelContents,
  inactivateAllTabs, selectTab
} from '/shared/scripts/panelTabs.js';

/*****************************************************************************/


window.initialize = function () {
  console.log('Initializing artikkelit');

  initializeTabs();

  initArticleForm();
  catchLogout();
}

function initializeTabs() {
  const newArticleTab = document.getElementById('panelTabNewArticle');

  addTabsEventListeners(activateTab);
  clearAllTabSelections();

  selectTab(newArticleTab);
  activateTab(newArticleTab);

}

function inactivateTab(tab) {
  // no tab specific functions, just hide all panel contents
  if (tab.id === 'panelTabNewArticle' || tab.id === 'panelTabEditor') {
    hideAllPanelContents();
  }
}

export function activateTab(tab) {
  inactivateAllTabs(inactivateTab);

  if (tab.id === 'panelTabNewArticle') {
    const articles = document.getElementById('artikkelit');
    articles.style.display = '';
    return;
  }

  if (tab.id === 'panelTabEditor') {
    const editor = document.getElementById('editori');
    editor.style.display = '';
    return;
  }

}

function catchLogout(){
  const logoutLink = document.querySelector('.logout a');
  if(logoutLink){
    logoutLink.addEventListener('click', async function(event){
      //actions before user is directed to /logout
      //clear local data here
      await idbClearAll();
    });
  }
}