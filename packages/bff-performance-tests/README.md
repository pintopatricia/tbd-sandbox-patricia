# Performance Tests

## Environment Configuration

The TBD PRF environment should **NOT be accessed by the domain** (e.g. http://ie1-tbd-prf.prf.betfair/betting): each machine is used in an automated test and by navigating through the PRF domain, you may hit a machine through the netscaler/load balancer that is currently being tested and therefore interfere with the results. If the domain is broken, this is expected behaviour.

As such, **each machine is accessed by it's own address**, i.e.: http://ie1-tbd06-prf.prf.betfair:8080/betting/

The last machine should not be used by the prf tests, it is meant for testing local changes against it (check i2 inventory and wdio grid conf).

Currently, TBDN is not tested, only BFF for TBD queries is covered.

The setup is as follows:

- IE1 is connected to a mockserver inside the respective IE2 machine.
- Each IE1 machine only contacts BFF inside itself (ie1-tbd01 access-control only calls ie1-tbd01 bff-gql)
- IE1 is load tested from jenkins job runner (https://jenkins-prd.prd.betfair/job/tbd_bff_gql_performance_tests)
- IE2 should only handle mockserver load

The tests do the following:

- Run a wdio scenario (should be a user journey, only most popular journeys should be tested)
- BFF/Acess control requests are recorded
- Each BFF/Acess control is repeated to record it's downstream services requests (mockserver handles this)
- These downstream service mocks (facet, cal, sca, ...) are injected in the mockserver
- The jenkins runner load tests the IE1 machine, IE2 machine has the mockserver and fakes all network requests
- Metrics are recorded up to 10k reqs, test stops, mockserver is cleared
- This is repeated until all BFF requests are tested for each page
- The html static report shows all the metrics for all the scenarios
- Test paralelism is done through N wdio runners in N separate PRF machines

## How to use mock replay tool in PRF ENV

1. PRF env is available [here](http://ie1-tbd06-prf.prf.betfair:8080/betting/) and mockserver dashboard [here](https://ie2-tbd06-prf.prf.betfair:1081/mockserver/dashboard)

2. `yarn mockreplay:curl`

- will output stdio to a script with all the curls to mockserver

2. `yarn mockreplay:har`

- will output stdio to a har file to mockserver

2. `yarn mockreplay:postman`

- will output stdio to a postman collection

2. `./replay-curl.sh`

- will run all the curl mocks to mockserver

3. The `mock-replay-tool.js` will output stderr with the curls you need to do for BFF

- Call each one and the BFF response should be fully mocked

4. Don't forget to clean mockserver after playing with it (script outputs a reset curl in the end if you need it)

5. Check documentation of [mockserver](https://www.mock-server.com/mock_server/creating_expectations.html) to learn how to modify the curl requests to your tests

Options

- Configure `MOCK_SERVER_HOST`, `STRAND_URL` to env you want (localhost or prf)
- Open TBD in chrome, go to network panel and filter requests to /catalog
  - Copy the request payload (view source) into `requests` array
- If you want to view mocks in TBD site instead of just calling BFF, comment the `// COMMENT this line if you want unfiltered`
