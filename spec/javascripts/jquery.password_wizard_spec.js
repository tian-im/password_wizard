(function() {

  jQuery(function($) {
    describe('PasswordGenerator', function() {
      return describe('#run', function() {
        it('must return default length of case-insensitive alphanumbers when no candidates are specified', function() {
          var password;
          password = new PasswordGenerator().run();
          expect(password).toMatch('[\\d\\w]{8}');
          return expect(password.length).toEqual(8);
        });
        it('must return specified length of case-insensitive alphanumbers when no candidates are specified', function() {
          var password;
          password = new PasswordGenerator(10).run();
          expect(password).toMatch('[\\d\\w]{10}');
          return expect(password.length).toEqual(10);
        });
        return it('must return specified length of characters when candidates are alphabets', function() {
          var password;
          password = new PasswordGenerator(12, PasswordWizard.DIGITS).run();
          expect(password).toMatch('\\d{10}');
          return expect(password.length).toEqual(12);
        });
      });
    });
    describe('PasswordFrequencyChecker', function() {
      return describe('#run', function() {
        it("must return false when the frequency of the required chars is less than required", function() {
          var check, password;
          password = 'abcdefGH1LKJj';
          check = new PasswordFrequencyChecker(password, PasswordWizard.DIGITS, 2);
          expect(check.password).toEqual(password);
          return expect(check.run()).toBeFalsy();
        });
        return it("must return true when the frequency of the required chars is more than required", function() {
          var check, password;
          password = 'ab3cd5efJj';
          check = new PasswordFrequencyChecker(password, PasswordWizard.DIGITS, 2);
          expect(check.password).toEqual(password);
          return expect(check.run()).toBeTruthy();
        });
      });
    });
    describe('PasswordWatchdog', function() {
      return describe('#test', function() {
        it('must return false when the password is not satisfying the rule', function() {
          var password, rules, watchdog;
          password = 'abGH1LKJj';
          rules = [[PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 4], [PasswordFrequencyChecker, PasswordWizard.DIGITS, 1]];
          watchdog = new PasswordWatchdog(password, rules);
          return expect(watchdog.test()).toBeFalsy();
        });
        return it('must return true when the password is satisfying the rule', function() {
          var password, rules, watchdog;
          password = 'ab3cd5efJj';
          rules = [[PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 2], [PasswordFrequencyChecker, PasswordWizard.DIGITS, 2]];
          watchdog = new PasswordWatchdog(password, rules);
          return expect(watchdog.test()).toBeTruthy();
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
          password_wizard.add_candidate(PasswordWizard.CASE_ALPHANUMBERS);
          password = password_wizard.generate();
          return expect(password).toMatch('[\\d\\w]{8}');
        });
        return it('must return password with at least 2 digits', function() {
          var password, password_wizard, rule, watchdog;
          password_wizard = new PasswordWizard();
          password_wizard.add_candidate(PasswordWizard.CASE_ALPHANUMBERS);
          rule = [PasswordFrequencyChecker, PasswordWizard.DIGITS, 2];
          password_wizard.add_rule.apply(password_wizard, rule);
          password = password_wizard.generate();
          expect(password).toMatch('[\\d\\w]{8}');
          watchdog = new PasswordWatchdog(password, [rule]);
          return expect(watchdog.test()).toBeTruthy();
        });
      });
    });
  });

}).call(this);
