
/*
 * Password Wizard v0.0.1
 * @summary generate the password using different set of chars and rules
 * @source_code https://github.com/chentianwen/password_wizard
 *
 * @copyright 2011, Tianwen Chen
 * @website https://github.tian.im
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
*/


(function() {
  "use_strict";

  var __slice = [].slice;

  window.PasswordGenerator = (function() {

    function PasswordGenerator(length, candidate_array) {
      this.length = length != null ? length : PasswordWizard.DEFAULT_LENGTH;
      this.candidate_array = candidate_array != null ? candidate_array : [PasswordWizard.CASE_ALPHANUMBERS];
      if ((typeof this.candidate_array) === 'string') {
        this.candidate_array = [this.candidate_array];
      }
      this.candidates = this.candidate_array.join('');
    }

    PasswordGenerator.prototype.position = function() {
      return Math.floor(Math.random() * this.candidates.length);
    };

    PasswordGenerator.prototype.one_char = function(position) {
      return this.candidates.charAt(this.position());
    };

    PasswordGenerator.prototype.run = function() {
      var len, result;
      result = (function() {
        var _i, _ref, _results;
        _results = [];
        for (len = _i = 1, _ref = this.length; 1 <= _ref ? _i <= _ref : _i >= _ref; len = 1 <= _ref ? ++_i : --_i) {
          _results.push(this.one_char());
        }
        return _results;
      }).call(this);
      return result.join('');
    };

    return PasswordGenerator;

  })();

  window.PasswordFrequencyChecker = (function() {

    function PasswordFrequencyChecker(password, candidate_array, frequency) {
      this.password = password;
      this.candidate_array = candidate_array;
      this.frequency = frequency;
      if ((typeof this.candidate_array) === 'string') {
        this.candidate_array = [this.candidate_array];
      }
      this.pattern = new RegExp("[" + (this.candidate_array.join('')) + "]", RegExp.global);
    }

    PasswordFrequencyChecker.prototype.run = function() {
      var frequency, password_phrase, position, _i, _ref;
      password_phrase = this.password;
      for (frequency = _i = 1, _ref = this.frequency; 1 <= _ref ? _i <= _ref : _i >= _ref; frequency = 1 <= _ref ? ++_i : --_i) {
        if ((position = password_phrase.search(this.pattern)) < 0) {
          return false;
        }
        password_phrase = password_phrase.substring(position + 1);
      }
      return true;
    };

    return PasswordFrequencyChecker;

  })();

  window.PasswordWatchdog = (function() {

    function PasswordWatchdog(password, rules) {
      this.password = password;
      this.rules = rules != null ? rules : [];
    }

    PasswordWatchdog.prototype.test = function() {
      var rule, _i, _len, _ref;
      if (!this.password) {
        return false;
      }
      _ref = this.rules;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (!(function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args), t = typeof result;
          return t == "object" || t == "function" ? result || child : child;
        })(rule[0], [this.password].concat(__slice.call(rule.slice(1))), function(){}).run()) {
          return false;
        }
      }
      return true;
    };

    return PasswordWatchdog;

  })();

  window.PasswordWizard = (function() {

    function PasswordWizard() {}

    PasswordWizard.title = 'Password Wizard';

    PasswordWizard.version = '0.0.1';

    PasswordWizard.DIGITS = '0123456789';

    PasswordWizard.ALPHABETS = 'zxcvbqwertasdfgyuiophjklnm';

    PasswordWizard.SYMBOLS = '~`!@#$%^&*()-_+={[}]|\\:;"\'<,>.?/';

    PasswordWizard.UPCASE_ALPHABETS = PasswordWizard.ALPHABETS.toUpperCase();

    PasswordWizard.ALPHANUMBERS = PasswordWizard.DIGITS + PasswordWizard.ALPHABETS;

    PasswordWizard.CASE_ALPHABETS = PasswordWizard.ALPHABETS + PasswordWizard.UPCASE_ALPHABETS;

    PasswordWizard.CASE_ALPHANUMBERS = PasswordWizard.ALPHANUMBERS + PasswordWizard.UPCASE_ALPHABETS;

    PasswordWizard.DEFAULT_LENGTH = 8;

    PasswordWizard.prototype.length = function(length) {
      var _ref;
      if (length == null) {
        length = void 0;
      }
      if (length != null) {
        this.len = length;
        return this;
      } else {
        return (_ref = this.len) != null ? _ref : this.len = PasswordWizard.DEFAULT_LENGTH;
      }
    };

    PasswordWizard.prototype.rules = [];

    PasswordWizard.prototype.add_rule = function() {
      var args, checker;
      checker = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.rules.push([checker].concat(__slice.call(args)));
    };

    PasswordWizard.prototype.candidates = [];

    PasswordWizard.prototype.add_candidate = function(candidate) {
      return this.candidates.push(candidate);
    };

    PasswordWizard.prototype.generate = function() {
      var password;
      while (!new PasswordWatchdog(password, this.rules).test()) {
        password = new PasswordGenerator(this.len, this.candidates).run();
      }
      return password;
    };

    return PasswordWizard;

  })();

}).call(this);
