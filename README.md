This is a small demo of integration API autotests, written with AVA framework https://ava.li

I chose Adafruit API as an object of testing - simply because it is public and IOT-related.
Docs for API can be found here https://io.adafruit.com/api/docs

To run tests, do
```
npm i
npm test
```

That will run all files in test directory, except files in /helpers/ dir.
Tests run concurrently, except tests that are marked with .serial modifier
https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#running-tests-serially
This makes whole suit execution much faster than in Mocha.

In test/feed.js you will find integration tests for Adafruit /feeds endpoint.
You may notice a use of a macro to test some combinations of invalid inputs for create feed handler
https://io.adafruit.com/api/docs/#create-feed.
Response json for create feed handler is verified against schema with tv4 validator.

There are also couple of tests for /data endpoint, to demonstrate how tests may add datapoints to 
created feeds. This is where reusable functions like createFeed() (in test/helpers/shortcuts.js)
become handy.

To prepare db for testing, npm pretest runs test/helpers/pretest.js script. In this case, it deletes
all feeds from account. Normally, it would create some fixtures for tests to rely on.

Fixtures itself are stored in test/helpers/fixtures.js
