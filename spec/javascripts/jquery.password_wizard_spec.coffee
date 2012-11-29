jQuery ($) ->
  # test cases
  describe 'PasswordGenerator', ->
    describe '#one_char', ->
      it 'must return one char from the character candidates', ->
        generator = new PasswordGenerator()
        candidates = generator.candidates
        for i in [ 0...1000 ]
          index = candidates.indexOf(generator.one_char())
          expect(index >= 0 && index < candidates.length).toBeTruthy()

    describe '#generate', ->
      it 'must return default length of case-insensitive alphanumbers when no candidates are specified', ->
        password = new PasswordGenerator().generate()
        expect(password).toMatch('[\\d\\w]{8}')
        expect(password.length).toEqual(8)

      it 'must return specified length of case-insensitive alphanumbers when no candidates are specified', ->
        password = new PasswordGenerator(10).generate()
        expect(password).toMatch('[\\d\\w]{10}')
        expect(password.length).toEqual(10)

      it 'must return specified length of characters when candidates are alphabets', ->
        password = new PasswordGenerator(12, PasswordWizard.DIGITS).generate()
        expect(password).toMatch('\\d{10}')
        expect(password.length).toEqual(12)

  describe 'PasswordFrequencyChecker', ->
    describe '#check', ->
      it "must return false when the frequency of the required chars is less than required", ->
        password = '1'
        check = new PasswordFrequencyChecker(PasswordWizard.DIGITS, 3) 
        expect(check.check(password)).toBeFalsy()

      it "must return true when the frequency of the required chars is more than required", ->
        password = '123'
        check = new PasswordFrequencyChecker(PasswordWizard.DIGITS, 3) 
        expect(check.check(password)).toBeTruthy()

  describe 'PasswordWatchdog', ->
    describe '#test', ->
      it 'must return false when the password is undefined', ->
        watchdog = new PasswordWatchdog()
        expect(watchdog.test(undefined)).toBeFalsy()

      it 'must return false when the password is not satisfying the rule', ->
        password = 'a1bcd'
        rules = [
          [ PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 4 ]
          [ PasswordFrequencyChecker, PasswordWizard.DIGITS, 2 ]
        ]
        watchdog = new PasswordWatchdog(rules)
        expect(watchdog.test(password)).toBeFalsy()

      it 'must return true when the password is satisfying the rule', ->
        password = 'a1b2'
        rules = [
          [ PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 2 ]
          [ PasswordFrequencyChecker, PasswordWizard.DIGITS, 2 ]
        ]
        watchdog = new PasswordWatchdog(rules)
        expect(watchdog.test(password)).toBeTruthy()

  describe 'PasswordWizard', ->
    describe '#length', ->
      it 'must return the password length of 8 by default', ->
        expect(new PasswordWizard().length()).toEqual(8)

      it 'must return the specified length after using with_length', ->
        password_wizard = new PasswordWizard()
        password_wizard_after_with_length = password_wizard.length(10)
        expect(password_wizard).toEqual(password_wizard_after_with_length)
        expect(password_wizard.length()).toEqual(10)

    describe '#generate', ->
      it 'must return password with 8 case-insensitive alphanumbers', ->
        password_wizard = new PasswordWizard()
        password_wizard.add_candidate(PasswordWizard.ALPHANUMBERS)
        password = password_wizard.generate()
        expect(password).toMatch('[\\d\\w]{8}')

      it 'must return password with at least 2 digits', ->
        password_wizard = new PasswordWizard()
        password_wizard.add_candidate(PasswordWizard.ALPHANUMBERS)
        rule = [ PasswordFrequencyChecker, PasswordWizard.DIGITS, 2 ]
        password_wizard.add_rule(rule...)
        password = password_wizard.generate()
        expect(password).toMatch('[\\d\\w]{8}')
        watchdog = new PasswordWatchdog([ rule ])
        expect(watchdog.test(password)).toBeTruthy()

