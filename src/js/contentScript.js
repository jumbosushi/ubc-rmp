(async () => {
  const src = chrome.extension.getURL('src/js/contentMain.js');
  const contentScript = await import(src);
  contentScript.main();
})();
