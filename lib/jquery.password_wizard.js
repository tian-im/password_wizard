
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

  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  window.PasswordGenerator = (function() {

    function PasswordGenerator(length, candidates) {
      this.length = length != null ? length : PasswordWizard.DEFAULT_LENGTH;
      this.candidates = candidates != null ? candidates : PasswordWizard.ALPHANUMBERS;
      if (this.candidates instanceof Array) {
        this.candidates = this.candidates.join('');
      }
    }

    PasswordGenerator.prototype.one_char = function() {
      return this.candidates.charAt(Math.floor(Math.random() * this.candidates.length));
    };

    PasswordGenerator.prototype.generate = function() {
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

    function PasswordFrequencyChecker(candidates, frequency) {
      this.candidates = candidates;
      this.frequency = frequency;
      if (this.candidates instanceof Array) {
        this.candidates = this.candidates.join('');
      }
      this.pattern = new RegExp("[" + this.candidates + "]", RegExp.global);
    }

    PasswordFrequencyChecker.prototype.check = function(password) {
      var frequency, password_phrase, position, _i, _ref;
      password_phrase = password;
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

  window.DigitsFrequencyChecker = (function(_super) {

    __extends(DigitsFrequencyChecker, _super);

    function DigitsFrequencyChecker(frequency) {
      DigitsFrequencyChecker.__super__.constructor.call(this, PasswordWizard.DIGITS, frequency);
    }

    return DigitsFrequencyChecker;

  })(PasswordFrequencyChecker);

  window.AlphabetsFrequencyChecker = (function(_super) {

    __extends(AlphabetsFrequencyChecker, _super);

    function AlphabetsFrequencyChecker(frequency) {
      AlphabetsFrequencyChecker.__super__.constructor.call(this, PasswordWizard.ALPHABETS, frequency);
    }

    return AlphabetsFrequencyChecker;

  })(PasswordFrequencyChecker);

  window.SymbolsFrequencyChecker = (function(_super) {

    __extends(SymbolsFrequencyChecker, _super);

    function SymbolsFrequencyChecker(frequency) {
      SymbolsFrequencyChecker.__super__.constructor.call(this, PasswordWizard.SYMBOLS, frequency);
    }

    return SymbolsFrequencyChecker;

  })(PasswordFrequencyChecker);

  window.PasswordWatchdog = (function() {

    function PasswordWatchdog(rules) {
      var rule;
      this.rules = rules != null ? rules : [];
      this.rules = (function() {
        var _i, _len, _ref, _results;
        _ref = this.rules;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rule = _ref[_i];
          _results.push((function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args), t = typeof result;
            return t == "object" || t == "function" ? result || child : child;
          })(rule[0], rule.slice(1), function(){}));
        }
        return _results;
      }).call(this);
    }

    PasswordWatchdog.prototype.test = function(password) {
      var rule, _i, _len, _ref;
      if (password == null) {
        return false;
      }
      _ref = this.rules;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rule = _ref[_i];
        if (!rule.check(password)) {
          return false;
        }
      }
      return true;
    };

    return PasswordWatchdog;

  })();

  window.PasswordWizard = (function() {

    PasswordWizard.TITLE = 'Password Wizard';

    PasswordWizard.VERSION = '0.0.1';

    PasswordWizard.DIGITS = '0123456789';

    PasswordWizard.DOWNCASE_ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';

    PasswordWizard.SYMBOLS = '~`!@#$%^&*()-_+={[}]|\\:;"\'<,>.?/';

    PasswordWizard.UPCASE_ALPHABETS = PasswordWizard.DOWNCASE_ALPHABETS.toUpperCase();

    PasswordWizard.DOWNCASE_ALPHANUMBERS = PasswordWizard.DOWNCASE_ALPHABETS + PasswordWizard.DIGITS;

    PasswordWizard.ALPHABETS = PasswordWizard.DOWNCASE_ALPHABETS + PasswordWizard.UPCASE_ALPHABETS;

    PasswordWizard.ALPHANUMBERS = PasswordWizard.DOWNCASE_ALPHANUMBERS + PasswordWizard.UPCASE_ALPHABETS;

    PasswordWizard.TYPE_SAFES = 'iIl1|oO0';

    PasswordWizard.DEFAULT_LENGTH = 8;

    PasswordWizard.MAX_ATTAMPTS = 88;

    function PasswordWizard() {
      this.rules = [];
      this.candidates = [];
    }

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

    PasswordWizard.prototype.add_rule = function() {
      var args, checker;
      checker = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.rules.push([checker].concat(__slice.call(args)));
    };

    PasswordWizard.prototype.add_candidate = function(candidate) {
      return this.candidates.push(candidate);
    };

    PasswordWizard.prototype.generate = function() {
      var attampts, password, watchdog;
      attampts = 0;
      watchdog = new PasswordWatchdog(this.rules);
      while (!watchdog.test(password)) {
        if (attampts++ >= PasswordWizard.MAX_ATTAMPTS) {
          return '';
        }
        password = new PasswordGenerator(this.len, this.candidates).generate();
      }
      return password;
    };

    return PasswordWizard;

  })();

}).call(this);
