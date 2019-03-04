// Loads contentMain.js which loads all other js files
(async () => {
  const src = chrome.extension.getURL('src/js/contentMain.js');
  const contentScript = await import(src);
  contentScript.main();
})();
