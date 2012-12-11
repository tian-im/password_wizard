(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  jQuery(function($) {
    $('h1.title').text("" + PasswordWizard.TITLE + " " + PasswordWizard.VERSION);
    window.PasswordWizardStrategy = (function() {

      function PasswordWizardStrategy() {
        this.candidates = PasswordWizard.ALPHANUMBERS;
        this.type_safe = false;
        this.digits_checker_length = 2;
        this.letters_checker_length = 2;
        this.symbols_checker_length = void 0;
        this.length = 8;
        this.samples = 10;
      }

      PasswordWizardStrategy.prototype.set = function(property, value) {
        switch (property) {
          case 'type_safe':
            value = value.match(/true|t/i) != null;
            break;
          case 'digits_checker_length':
          case 'letters_checker_length':
          case 'symbols_checker_length':
          case 'length':
          case 'samples':
            if (value === '') {
              value = void 0;
            }
        }
        if (property === 'candidates') {
          return this.candidates = value;
        } else {
          return eval("this." + property + " = " + value);
        }
      };

      PasswordWizardStrategy.prototype.eq = function(other) {
        var property, _i, _len, _ref;
        if (other == null) {
          return false;
        }
        _ref = ['candidates', 'type_safe', 'digits_checker_length', 'letters_checker_length', 'symbols_checker_length', 'length'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          if (!eval("other." + property + " == this." + property)) {
            return false;
          }
        }
        return true;
      };

      PasswordWizardStrategy.prototype.execute = function() {
        var len, pw, _i, _ref, _results;
        pw = new PasswordWizard();
        pw.length(this.length);
        pw.candidates = this.candidates;
        if (this.digits_checker_length != null) {
          pw.add_rule(DigitsFrequencyChecker, this.digits_checker_length);
        }
        if (this.letters_checker_length != null) {
          pw.add_rule(AlphabetsFrequencyChecker, this.letters_checker_length);
        }
        if (this.symbols_checker_length != null) {
          pw.add_rule(SymbolsFrequencyChecker, this.symbols_checker_length);
        }
        _results = [];
        for (len = _i = 1, _ref = this.samples; 1 <= _ref ? _i <= _ref : _i >= _ref; len = 1 <= _ref ? ++_i : --_i) {
          _results.push(pw.generate());
        }
        return _results;
      };

      return PasswordWizardStrategy;

    })();
    window.FourDigitsPINStrategy = (function(_super) {

      __extends(FourDigitsPINStrategy, _super);

      function FourDigitsPINStrategy() {
        FourDigitsPINStrategy.__super__.constructor.apply(this, arguments);
        this.candidates = PasswordWizard.DIGITS;
        this.digits_checker_length = 4;
        this.letters_checker_length = void 0;
        this.length = 4;
      }

      return FourDigitsPINStrategy;

    })(PasswordWizardStrategy);
    window.ThreeDicesStrategy = (function(_super) {

      __extends(ThreeDicesStrategy, _super);

      function ThreeDicesStrategy() {
        ThreeDicesStrategy.__super__.constructor.apply(this, arguments);
        this.candidates = '123456';
        this.digits_checker_length = 3;
        this.letters_checker_length = void 0;
        this.length = 3;
      }

      return ThreeDicesStrategy;

    })(PasswordWizardStrategy);
    window.HEXColorStrategy = (function(_super) {

      __extends(HEXColorStrategy, _super);

      function HEXColorStrategy() {
        HEXColorStrategy.__super__.constructor.apply(this, arguments);
        this.candidates = '0123456789ABCDEF';
        this.digits_checker_length = void 0;
        this.letters_checker_length = void 0;
        this.length = 6;
      }

      return HEXColorStrategy;

    })(PasswordWizardStrategy);
    window.PasswordWizardManager = (function() {

      function PasswordWizardManager() {}

      PasswordWizardManager.include = function(source, str) {
        var i, _i, _ref;
        for (i = _i = 0, _ref = str.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (source.indexOf(str.charAt(i)) < 0) {
            return false;
          }
        }
        return true;
      };

      PasswordWizardManager.exclude = function(source, str) {
        var i, _i, _ref;
        for (i = _i = 0, _ref = str.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          if (source.indexOf(str.charAt(i)) >= 0) {
            return false;
          }
        }
        return true;
      };

      PasswordWizardManager.reload = function(strategy) {
        var $item, item, _i, _len, _ref;
        if (strategy == null) {
          strategy = this.strategy();
        }
        $('#custom').val(strategy.candidates);
        $('#digits').prop('checked', this.include(strategy.candidates, PasswordWizard.DIGITS));
        $('#letters').prop('checked', this.include(strategy.candidates, PasswordWizard.DOWNCASE_ALPHABETS));
        $('#uppercase_letters').prop('checked', this.include(strategy.candidates, PasswordWizard.UPCASE_ALPHABETS));
        $('#symbols').prop('checked', this.include(strategy.candidates, PasswordWizard.SYMBOLS));
        $('#type_safe').prop('checked', this.exclude(strategy.candidates, PasswordWizard.TYPE_SAFES));
        $('#digits_checker_length').val(strategy.digits_checker_length);
        $('#letters_checker_length').val(strategy.letters_checker_length);
        $('#symbols_checker_length').val(strategy.symbols_checker_length);
        $('#password_length').val(strategy.length);
        $('#password_samples').val(strategy.samples);
        _ref = ['#four_digits_pin', '#three_dices', '#hex_color'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          $item = $(item);
          if (strategy.eq($item.data('strategy'))) {
            return $item.prop('checked', true);
          }
        }
        return $('#general').prop('checked', true);
      };

      PasswordWizardManager.update = function(property, value) {
        var strategy;
        strategy = this.strategy();
        strategy.set(property, value);
        return this.reload(strategy);
      };

      PasswordWizardManager.strategy = function() {
        return $('#general').data('strategy');
      };

      PasswordWizardManager.remove_candidates = function(str) {
        var candidates;
        candidates = $('#custom').val().replace(new RegExp("[" + str + "]", 'g'), '');
        return this.update('candidates', candidates);
      };

      PasswordWizardManager.add_candidates = function(str) {
        var candidates;
        candidates = str + $('#custom').val().replace(new RegExp("[" + str + "]", 'g'), '');
        return this.update('candidates', candidates);
      };

      PasswordWizardManager.init = function() {
        var self;
        self = this;
        $('#custom').change(function() {
          return self.update('candidates', $(this).val());
        });
        $('#password_length').change(function() {
          return self.update('length', $(this).val());
        });
        $('#password_samples').change(function() {
          return self.update('samples', $(this).val());
        });
        $('#digits_checker_length').change(function() {
          return self.update('digits_checker_length', $(this).val());
        });
        $('#letters_checker_length').change(function() {
          return self.update('letters_checker_length', $(this).val());
        });
        $('#symbols_checker_length').change(function() {
          return self.update('symbols_checker_length', $(this).val());
        });
        $('#digits').change(function() {
          if ($(this).is(':checked')) {
            return self.add_candidates(PasswordWizard.DIGITS);
          } else {
            return self.remove_candidates(PasswordWizard.DIGITS);
          }
        });
        $('#letters').change(function() {
          if ($(this).is(':checked')) {
            return self.add_candidates(PasswordWizard.DOWNCASE_ALPHABETS);
          } else {
            return self.remove_candidates(PasswordWizard.DOWNCASE_ALPHABETS);
          }
        });
        $('#uppercase_letters').change(function() {
          if ($(this).is(':checked')) {
            return self.add_candidates(PasswordWizard.UPCASE_ALPHABETS);
          } else {
            return self.remove_candidates(PasswordWizard.UPCASE_ALPHABETS);
          }
        });
        $('#symbols').change(function() {
          var candidates;
          if ($(this).is(':checked')) {
            return self.add_candidates(PasswordWizard.SYMBOLS);
          } else {
            candidates = PasswordWizard.SYMBOLS.replace(/([\.\[\]\\\(\)\?\$\^\+\*])/g, '\\$1');
            return self.remove_candidates(candidates);
          }
        });
        $('#type_safe').change(function() {
          var candidates;
          if ($(this).is(':checked')) {
            candidates = PasswordWizard.TYPE_SAFES.replace(/([\.\[\]\\\(\)\?\$\^\+\*])/g, '\\$1');
            return self.remove_candidates(candidates);
          }
        });
        $('#four_digits_pin').data('strategy', new FourDigitsPINStrategy());
        $('#three_dices').data('strategy', new ThreeDicesStrategy());
        $('#hex_color').data('strategy', new HEXColorStrategy());
        $('#four_digits_pin, #three_dices, #hex_color').click(function() {
          return $('#general').data('strategy', $.extend({}, $(this).data('strategy')));
        });
        $('#general').click(function() {
          return $(this).data('strategy', new PasswordWizardStrategy());
        });
        $('input[name=purpose]').click(function() {
          return self.reload();
        });
        $('button.btn').click(function() {
          var passwords;
          passwords = self.strategy().execute();
          $('#result').empty();
          return $.map(passwords, function(p) {
            return $('#result').append($('<div />').addClass('sample').text(p));
          });
        });
        $('#general').click();
        return $('button.btn').click();
      };

      return PasswordWizardManager;

    })();
    return PasswordWizardManager.init();
  });

}).call(this);
