(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jQuery(function($) {
    var MyReporter, jasmineEnv, myReporter;
    MyReporter = (function(_super) {

      __extends(MyReporter, _super);

      function MyReporter() {
        return MyReporter.__super__.constructor.apply(this, arguments);
      }

      MyReporter.prototype.reportRunnerResults = function(runner) {
        var result;
        MyReporter.__super__.reportRunnerResults.apply(this, arguments);
        result = runner.results().failedCount === 0 ? 'passed' : 'failed';
        if (self !== top) {
          return top.document.getElementById('jasmine-build-status').className = result;
        }
      };

      return MyReporter;

    })(jasmine.TrivialReporter);
    jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;
    myReporter = new MyReporter();
    jasmineEnv.addReporter(myReporter);
    jasmineEnv.specFilter = function(spec) {
      return myReporter.specFilter(spec);
    };
    return jasmineEnv.execute();
  });

}).call(this);
