const { getMockingService } = require("@ppb/bff-mocking-server-common");

const { requestAccessControl } = getMockingService();

describe("Regular expression catastrophic backtracking", () => {
  let result;

  describe(`when a user sends an url with headers in query params and hosts=`, () => {
    beforeAll(async () => {
      result = await requestAccessControl({
        baseHref: `/apostas/br/?product=SBK%7CGAM&loginStatus=SUCCESS&%20_mibhv=77.438.654_4795;%20_gp=l%3Dpt%7Cli%3D1%7Cp%3Dgaming%7Cpl%3Dm%7Cr%3D1%7Ca%3D77438654;%20_gat=1;%20_ga_7YVN2PDRZW=GS1.2.1688824998.4.0.1688824998.0.0.0;%20ssoid=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=;%20loggedIn=true;%20lka=1688825015095;%20ccawa=2542125674787736363367613796338877419790;%20OptanonConsent=isGpcEnabled=0&datestamp=Sat+Jul+08+2023+11%3A03%3A36+GMT-0300+(Hor%C3%A1rio+Padr%C3%A3o+de+Bras%C3%ADlia)&version=6.18.0&isIABGlobal=false&hosts=&consentId=77438654&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A1&geolocation=%3B&AwaitingReconsent=false;%20gtmfl=4i+Df;%20Qualtrics_Cookie=77419790;%20TEAL=v:21892c438d74722660608686108563378591a7074f2$t:1688826816695$sn:6$en:2$s:1688824939668%3Bexp-sess;%20_scid_r=fb724fe6-8861-48a0-8450-497b20686eb4;%20_uetsid=22727f601c2311ee9ce60d801e7cae93;%20_uetvid=2272b9f01c2311eeb5cbe76259dba72d;%20_ga_K0W97M6SNZ=GS1.1.1688824940.5.0.1688825016.60.0.0;%20_ga=GA1.1.301870050.1688664772;%20QuantumMetricSessionID=eff593bf5f2b0a28ea047487a93fe5de;%20QuantumMetricUserID=5f6a4c9c064a2218a7a4d4b83317198e;%20qm_current_url=https://myaccount.betfair.com/account/navigation?prod=8&loginStatus=SUCCESS&ott=Bym9nr0qLJJDNdOITlfIfhPzo5fa%2F82f%2B8%2FvIgmDLnrgd2B52OIrIpJyEcIP0B%2Fb;`,
        language: "pt_BR",
        locale: "pt_BR",
      });
    });

    it("[1196210] should be able to respond and doesn't block in regex parsing", async () => {
      expect(result).not.toEqual(null);
    });
  });
});
