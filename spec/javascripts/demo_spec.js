(function() {

  jQuery(function($) {
    var set_fixtures, set_input;
    set_input = function(id, type, name) {
      if (type == null) {
        type = 'text';
      }
      if (name == null) {
        name = '';
      }
      return "<input type=\"" + type + "\" id=\"" + id + "\" name=\"" + name + "\"/>";
    };
    set_fixtures = function() {
      var f;
      f = "" + (set_input('general', 'radio', 'purpose')) + "\n" + (set_input('four_digits_pin', 'radio', 'purpose')) + "\n" + (set_input('three_dices', 'radio', 'purpose')) + "\n" + (set_input('hex_color', 'radio', 'purpose')) + "\n\n" + (set_input('custom')) + "\n" + (set_input('digits', 'checkbox')) + "\n" + (set_input('letters', 'checkbox')) + "\n" + (set_input('uppercase_letters', 'checkbox')) + "\n" + (set_input('symbols', 'checkbox')) + "\n\n" + (set_input('digits_checker_length')) + "\n" + (set_input('letters_checker_length')) + "\n" + (set_input('symbols_checker_length')) + "\n\n" + (set_input('password_length')) + "\n" + (set_input('password_samples'));
      return setFixtures(f);
    };
    describe('PasswordWizardStrategy', function() {
      describe('#execute', function() {
        return it('must return an array of strings which are the same size as the sample specified', function() {
          var strategy;
          strategy = new PasswordWizardStrategy();
          strategy.samples = 12;
          return expect(strategy.execute().length).toEqual(12);
        });
      });
      describe('#set', function() {
        var property, _i, _len, _ref;
        it('must format the value and set the type_safe as true', function() {
          var strategy;
          strategy = new PasswordWizardStrategy();
          strategy.set('type_safe', 't');
          expect(strategy.type_safe).toBeTruthy();
          strategy.set('type_safe', 'true');
          expect(strategy.type_safe).toBeTruthy();
          strategy.set('type_safe', 'TRUE');
          return expect(strategy.type_safe).toBeTruthy();
        });
        it('must format the value and set the type_safe as true', function() {
          var strategy;
          strategy = new PasswordWizardStrategy();
          strategy.set('type_safe', 'f');
          expect(strategy.type_safe).toBeFalsy();
          strategy.set('type_safe', 'false');
          expect(strategy.type_safe).toBeFalsy();
          strategy.set('type_safe', 'FALSE');
          expect(strategy.type_safe).toBeFalsy();
          strategy.set('type_safe', '');
          return expect(strategy.type_safe).toBeFalsy();
        });
        _ref = ['digits_checker_length', 'letters_checker_length', 'symbols_checker_length', 'length', 'samples'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          it("must format the value and set the " + property + " accordingly", function() {
            var strategy;
            strategy = new PasswordWizardStrategy();
            strategy.set(property, '');
            expect(eval("strategy." + property)).toBeUndefined();
            strategy.set(property, '11');
            return expect(eval("strategy." + property)).toEqual(11);
          });
        }
        return it('must assign the candidates correctly', function() {
          var strategy;
          strategy = new PasswordWizardStrategy();
          strategy.set('candidates', void 0);
          expect(strategy.candidates).toBeUndefined();
          strategy.set('candidates', '');
          expect(strategy.candidates).toEqual('');
          strategy.set('candidates', 'abc1234');
          return expect(strategy.candidates).toEqual('abc1234');
        });
      });
      describe('#eq', function() {
        it('must return true if all properties equal when they are instances of the same class', function() {
          var strategy, strategy2;
          strategy = new PasswordWizardStrategy();
          strategy2 = new PasswordWizardStrategy();
          return expect(strategy.eq(strategy2)).toBeTruthy();
        });
        it('must return true if all properties equal when they are instances of the different class', function() {
          var strategy, strategy2;
          strategy = new PasswordWizardStrategy();
          strategy.candidates = PasswordWizard.DIGITS;
          strategy.digits_checker_length = 4;
          strategy.letters_checker_length = void 0;
          strategy.length = 4;
          strategy2 = new FourDigitsPINStrategy();
          return expect(strategy.eq(strategy2)).toBeTruthy();
        });
        it('must return false if the comparing object is undefined', function() {
          var strategy;
          strategy = new PasswordWizardStrategy();
          return expect(strategy.eq(void 0)).toBeFalsy();
        });
        it('must return false if any of the properties is not the same', function() {
          var properties, property, strategy, strategy2, _i, _len, _results;
          strategy = new PasswordWizardStrategy();
          properties = [['candidates', 'something else'], ['type_safe', 'true'], ['digits_checker_length', '1000'], ['letters_checker_length', '1000'], ['symbols_checker_length', '1000'], ['length', '1000']];
          _results = [];
          for (_i = 0, _len = properties.length; _i < _len; _i++) {
            property = properties[_i];
            strategy2 = new PasswordWizardStrategy();
            strategy2.set(property[0], property[1]);
            _results.push(expect(strategy.eq(strategy2)).toBeFalsy());
          }
          return _results;
        });
        return it('must return true when samples are not the same, even if the samples are not the same', function() {
          var strategy, strategy2;
          strategy = new PasswordWizardStrategy();
          strategy2 = new PasswordWizardStrategy();
          strategy2.samples = 11;
          expect(strategy.samples).not.toEqual(strategy2.samples);
          return expect(strategy.eq(strategy2)).toBeTruthy();
        });
      });
      return describe('#execute', function() {
        return it('must return an array of strings', function() {
          var strategy;
          strategy = new PasswordWizardStrategy();
          return expect(strategy.execute().length).toEqual(strategy.samples);
        });
      });
    });
    return describe('PasswordWizardManager', function() {
      describe('::include', function() {
        it('must return true when string1 contains all chars from string2', function() {
          expect(PasswordWizardManager.include('abc1234', 'cb1')).toBeTruthy();
          return expect(PasswordWizardManager.include('abc1234', '1234abc')).toBeTruthy();
        });
        return it('must return false when string1 does not contain all chars from string2', function() {
          expect(PasswordWizardManager.include('abc1234', '5abc1234')).toBeFalsy();
          return expect(PasswordWizardManager.include('abc1234', '5')).toBeFalsy();
        });
      });
      describe('::exclude', function() {
        it('must return true when string1 does not contain any chars from string2', function() {
          return expect(PasswordWizardManager.exclude('abc1234', '5678')).toBeTruthy();
        });
        return it('must return false when string1 contains any chars from string2', function() {
          return expect(PasswordWizardManager.exclude('abc1234', '15678')).toBeFalsy();
        });
      });
      describe('::reload', function() {
        it('must set all the values for the general strategy after the init', function() {
          set_fixtures();
          PasswordWizardManager.init();
          PasswordWizardManager.reload();
          expect($('#custom').val()).toEqual(PasswordWizard.ALPHANUMBERS);
          expect($('#digits_checker_length').val()).toEqual('2');
          expect($('#letters_checker_length').val()).toEqual('2');
          expect($('#symbols_checker_length').val()).toEqual('');
          expect($('#password_length').val()).toEqual('8');
          expect($('#password_samples').val()).toEqual('10');
          expect($('#digits').is(':checked')).toBeTruthy();
          expect($('#letters').is(':checked')).toBeTruthy();
          expect($('#uppercase_letters').is(':checked')).toBeTruthy();
          expect($('#symbols').is(':checked')).toBeFalsy();
          return expect($('#type_safe').is(':checked')).toBeFalsy();
        });
        return it('must set all the values for a specified strategy', function() {
          var strategy;
          set_fixtures();
          PasswordWizardManager.init();
          strategy = new FourDigitsPINStrategy();
          PasswordWizardManager.reload(strategy);
          expect($('#custom').val()).toEqual(PasswordWizard.DIGITS);
          expect($('#digits_checker_length').val()).toEqual('4');
          expect($('#letters_checker_length').val()).toEqual('');
          expect($('#symbols_checker_length').val()).toEqual('');
          expect($('#password_length').val()).toEqual('4');
          expect($('#password_samples').val()).toEqual('10');
          expect($('#digits').is(':checked')).toBeTruthy();
          expect($('#letters').is(':checked')).toBeFalsy();
          expect($('#uppercase_letters').is(':checked')).toBeFalsy();
          expect($('#symbols').is(':checked')).toBeFalsy();
          expect($('#type_safe').is(':checked')).toBeFalsy();
          return expect($('input[name=purpose]:checked').is('#four_digits_pin')).toBeTruthy();
        });
      });
      describe('::update', function() {
        return it('must update the property accordingly', function() {
          set_fixtures();
          PasswordWizardManager.init();
          PasswordWizardManager.update('candidates', '1234');
          return expect(PasswordWizardManager.strategy().candidates).toEqual('1234');
        });
      });
      describe('::remove_candidates', function() {
        return it('must remove the candidates', function() {
          set_fixtures();
          PasswordWizardManager.init();
          PasswordWizardManager.update('candidates', '');
          PasswordWizardManager.remove_candidates(PasswordWizard.DIGITS);
          return expect(PasswordWizardManager.strategy().candidates).toEqual('');
        });
      });
      return describe('::add_candidates', function() {
        return it('must remove the candidates', function() {
          set_fixtures();
          PasswordWizardManager.init();
          PasswordWizardManager.update('candidates', '');
          PasswordWizardManager.add_candidates(PasswordWizard.DIGITS);
          return expect(PasswordWizardManager.strategy().candidates).toEqual(PasswordWizard.DIGITS);
        });
      });
    });
  });

}).call(this);
