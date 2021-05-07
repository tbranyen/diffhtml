// The injector is used to communicate from the UI layer to the extension.
// The extension communicates to the UI layer in contentscript.js
if (!window.__diffHTMLDevTools) {
  // This file gets loaded into the browser where the application is running.
  // It provides the bridge into the extension.
  const triggerEvent = (action, data) => {
    document.dispatchEvent(new CustomEvent(`diffHTML:${action}`, {
      detail: JSON.stringify({ action, data })
    }));
  };

  // A global hook for the devtools which is picked up by the application.
  window.__diffHTMLDevTools = () => ({
    activate(args={}) {
      triggerEvent('activated', args);
      return this;
    },

    startTransaction(startDate, args={}) {
      triggerEvent('start', { startDate, args });
      return this;
    },

    endTransaction(startDate, endDate, args={}) {
      triggerEvent('end', { startDate, endDate, args });
      return this;
    },

    ping() {
      triggerEvent('ping');
      return this;
    },
  });
}
