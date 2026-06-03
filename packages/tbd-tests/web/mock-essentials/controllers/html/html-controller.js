export const getHtmlFilePuppeteer = ({ path = "", content = "", bodyStyle = "" }) => ({
  pathRegex: path,
  response: `
    <html>
      <head></head>
      <body style="${bodyStyle}">
        ${content}
      </body>
    </html>`,
  method: "GET",
  headers: { "Content-Type": "text/html; charset=utf-8" },
  statusCode: 200,
  delay: 0,
});

export const getPaymentsWebGateway = () => ({
  pathRegex: ".*myfunds.*",
  // <html> and <body> style set as it is needed for a full size iframe mock
  response: `
    <html style="height: 100%; width: 100%">
      <head></head>
      <body style="height: 100%; margin: 0">
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: cyan;
          height: 100%;
          min-height: 100vh;
          min-width: 280px;
        ">
          <span style="font-size: 30px">PAYMENTS WEB</span>
        </div>
      </body>
    </html>`,
  method: "GET",
  headers: { "Content-Type": "text/html; charset=utf-8" },
  statusCode: 200,
  delay: 0,
});

export const getExchangeGraphsAggregations = () =>
  getHtmlFilePuppeteer({
    path: ".*graphs.*",
    content: `<div style="display: flex; align-items: center; justify-content: center; background-color: cyan; height: 100%; min-height: 100vh; min-width: 280px;">
  <span style="font-size: 30px">EXCHANGE GRAPHS AGGREGATIONS</span>
</div>`,
  });

module.exports = {
  getHtmlFilePuppeteer,
  getPaymentsWebGateway,
  getExchangeGraphsAggregations,
};
