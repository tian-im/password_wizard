jQuery ($) ->
  class MyReporter extends jasmine.TrivialReporter
    reportRunnerResults: (runner) ->
      super
      result = if runner.results().failedCount == 0
        'passed'
      else
        'failed'
      unless self == top
        top.document.getElementById('jasmine-build-status').className = result

  jasmineEnv = jasmine.getEnv()
  jasmineEnv.updateInterval = 1000
  myReporter = new MyReporter()
  jasmineEnv.addReporter myReporter
  jasmineEnv.specFilter = (spec) ->
    myReporter.specFilter spec

  jasmineEnv.execute()
