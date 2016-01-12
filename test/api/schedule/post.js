'use strict';

var _ = require('lodash'),
  apiAccepts = require('../../fixtures/api-accepts'),
  endpointName = _.startCase(__dirname.split('/').pop()),
  filename = _.startCase(__filename.split('/').pop().split('.').shift()),
  sinon = require('sinon');

describe(endpointName, function () {
  describe(filename, function () {
    var sandbox,
      hostname = 'localhost.example.com',
      acceptsJson = apiAccepts.acceptsJson(_.camelCase(filename)),
      acceptsJsonBody = apiAccepts.acceptsJsonBody(_.camelCase(filename)),
      acceptsHtml = apiAccepts.acceptsHtml(_.camelCase(filename)),
      time = new Date('2015-01-01').getTime(),
      //componentData = {},
      //scheduleData = { at: new Date('2015-01-01').getTime() },
      //layoutData = {},
      pageData = {};

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      sandbox.useFakeTimers();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('/schedule', function () {
      var path = this.title;

      beforeEach(function () {
        return apiAccepts.beforeEachTest({ sandbox: sandbox, hostname: hostname });
      });

      acceptsJson(path, {}, 400, { message: 'Missing "at" property as number.', code: 400 });
      acceptsHtml(path, {}, 406, '406 text/html not acceptable');

      acceptsJsonBody(path, {}, {}, 400, { message: 'Missing "at" property as number.', code: 400 });
      acceptsJsonBody(path, {}, {at: time}, 400, { message: 'Missing "publish" property as valid url.', code: 400 });
      acceptsJsonBody(path, {}, {at: time, publish: 'http://abc'}, 201, { _ref: 'localhost.example.com/schedule/some-uid', at: time, publish: 'http://abc' });
    });

    describe('/schedule/:name', function () {
      var path = this.title;

      beforeEach(function () {
        return apiAccepts.beforeEachTest({ sandbox: sandbox, hostname: hostname });
      });

      acceptsJson(path, {name: 'valid'}, 405, { allow:['get', 'delete'], code: 405, message: 'Method POST not allowed' });
      acceptsJsonBody(path, {name: 'valid'}, pageData, 405, { allow:['get', 'delete'], code: 405, message: 'Method POST not allowed' });
      acceptsHtml(path, {name: 'valid'}, 405, '405 Method POST not allowed');
    });
  });
});