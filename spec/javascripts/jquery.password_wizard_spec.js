(function() {

  jQuery(function($) {
    describe('PasswordGenerator', function() {
      describe('#one_char', function() {
        return it('must return one char from the character candidates', function() {
          var candidates, generator, i, index, _i, _results;
          generator = new PasswordGenerator();
          candidates = generator.candidates;
          _results = [];
          for (i = _i = 0; _i < 1000; i = ++_i) {
            index = candidates.indexOf(generator.one_char());
            _results.push(expect(index >= 0 && index < candidates.length).toBeTruthy());
          }
          return _results;
        });
      });
      return describe('#generate', function() {
        it('must return default length of case-insensitive alphanumbers when no candidates are specified', function() {
          var password;
          password = new PasswordGenerator().generate();
          expect(password).toMatch('[\\d\\w]{8}');
          return expect(password.length).toEqual(8);
        });
        it('must return specified length of case-insensitive alphanumbers when no candidates are specified', function() {
          var password;
          password = new PasswordGenerator(10).generate();
          expect(password).toMatch('[\\d\\w]{10}');
          return expect(password.length).toEqual(10);
        });
        return it('must return specified length of characters when candidates are alphabets', function() {
          var password;
          password = new PasswordGenerator(12, PasswordWizard.DIGITS).generate();
          expect(password).toMatch('\\d{10}');
          return expect(password.length).toEqual(12);
        });
      });
    });
    describe('PasswordFrequencyChecker', function() {
      return describe('#check', function() {
        it("must return false when the frequency of the required chars is less than required", function() {
          var check, password;
          password = '1';
          check = new PasswordFrequencyChecker(PasswordWizard.DIGITS, 3);
          return expect(check.check(password)).toBeFalsy();
        });
        return it("must return true when the frequency of the required chars is more than required", function() {
          var check, password;
          password = '123';
          check = new PasswordFrequencyChecker(PasswordWizard.DIGITS, 3);
          return expect(check.check(password)).toBeTruthy();
        });
      });
    });
    describe('PasswordWatchdog', function() {
      return describe('#test', function() {
        it('must return false when the password is undefined', function() {
          var watchdog;
          watchdog = new PasswordWatchdog();
          return expect(watchdog.test(void 0)).toBeFalsy();
        });
        it('must return false when the password is not satisfying the rule', function() {
          var password, rules, watchdog;
          password = 'a1bcd';
          rules = [[PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 4], [PasswordFrequencyChecker, PasswordWizard.DIGITS, 2]];
          watchdog = new PasswordWatchdog(rules);
          return expect(watchdog.test(password)).toBeFalsy();
        });
        return it('must return true when the password is satisfying the rule', function() {
          var password, rules, watchdog;
          password = 'a1b2';
          rules = [[PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 2], [PasswordFrequencyChecker, PasswordWizard.DIGITS, 2]];
          watchdog = new PasswordWatchdog(rules);
          return expect(watchdog.test(password)).toBeTruthy();
        });
      });
    });
    return describe('PasswordWizard', function() {
      describe('#length', function() {
        it('must return the password length of 8 by default', function() {
          return expect(new PasswordWizard().length()).toEqual(8);
        });
        return it('must return the specified length after using with_length', function() {
          var password_wizard, password_wizard_after_with_length;
          password_wizard = new PasswordWizard();
          password_wizard_after_with_length = password_wizard.length(10);
          expect(password_wizard).toEqual(password_wizard_after_with_length);
          return expect(password_wizard.length()).toEqual(10);
        });
      });
      return describe('#generate', function() {
        it('must return password with 8 case-insensitive alphanumbers', function() {
          var password, password_wizard;
          password_wizard = new PasswordWizard();
          password_wizard.add_candidate(PasswordWizard.ALPHANUMBERS);
          password = password_wizard.generate();
          return expect(password).toMatch('[\\d\\w]{8}');
        });
        return it('must return password with at least 2 digits', function() {
          var password, password_wizard, rule, watchdog;
          password_wizard = new PasswordWizard();
          password_wizard.add_candidate(PasswordWizard.ALPHANUMBERS);
          rule = [PasswordFrequencyChecker, PasswordWizard.DIGITS, 2];
          password_wizard.add_rule.apply(password_wizard, rule);
          password = password_wizard.generate();
          expect(password).toMatch('[\\d\\w]{8}');
          watchdog = new PasswordWatchdog([rule]);
          return expect(watchdog.test(password)).toBeTruthy();
        });
      });
    });
  });

}).call(this);
