export const webViewBridgeScript = `
(function() {
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    return new Promise((resolve, reject) => {
      const { method = 'GET', headers = {}, body = null } = options || {};
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'FETCH_REQUEST',
        url: url,
        method: method,
        headers: headers,
        body: body
      }));

      const responseHandler = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'FETCH_RESPONSE') {
          window.removeEventListener('message', responseHandler);
          if (data.ok) {
            resolve(new Response(data.body, {
              status: data.status,
              headers: data.headers
            }));
          } else {
            reject(new Error(data.error));
          }
        }
      };
      window.addEventListener('message', responseHandler);
    });
  };
})();
`;