jQuery ($) ->
  # test cases
  describe 'PasswordGenerator', ->
    describe '#run', ->
      it 'must return default length of case-insensitive alphanumbers when no candidates are specified', ->
        password = new PasswordGenerator().run()
        expect(password).toMatch('[\\d\\w]{8}')
        expect(password.length).toEqual(8)

      it 'must return specified length of case-insensitive alphanumbers when no candidates are specified', ->
        password = new PasswordGenerator(10).run()
        expect(password).toMatch('[\\d\\w]{10}')
        expect(password.length).toEqual(10)

      it 'must return specified length of characters when candidates are alphabets', ->
        password = new PasswordGenerator(12, PasswordWizard.DIGITS).run()
        expect(password).toMatch('\\d{10}')
        expect(password.length).toEqual(12)

  describe 'PasswordFrequencyChecker', ->
    describe '#run', ->
      it "must return false when the frequency of the required chars is less than required", ->
        password = 'abcdefGH1LKJj'
        check = new PasswordFrequencyChecker(password, PasswordWizard.DIGITS, 2) 
        expect(check.password).toEqual(password)
        expect(check.run()).toBeFalsy()

      it "must return true when the frequency of the required chars is more than required", ->
        password = 'ab3cd5efJj'
        check = new PasswordFrequencyChecker(password, PasswordWizard.DIGITS, 2) 
        expect(check.password).toEqual(password)
        expect(check.run()).toBeTruthy()

  describe 'PasswordWatchdog', ->
    describe '#test', ->
      it 'must return false when the password is not satisfying the rule', ->
        password = 'abGH1LKJj'
        rules = [
          [ PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 4 ]
          [ PasswordFrequencyChecker, PasswordWizard.DIGITS, 1 ]
        ]
        watchdog = new PasswordWatchdog(password, rules)
        expect(watchdog.test()).toBeFalsy()

      it 'must return true when the password is satisfying the rule', ->
        password = 'ab3cd5efJj'
        rules = [
          [ PasswordFrequencyChecker, PasswordWizard.ALPHABETS, 2 ]
          [ PasswordFrequencyChecker, PasswordWizard.DIGITS, 2 ]
        ]
        watchdog = new PasswordWatchdog(password, rules)
        expect(watchdog.test()).toBeTruthy()

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
        password_wizard.add_candidate(PasswordWizard.CASE_ALPHANUMBERS)
        password = password_wizard.generate()
        expect(password).toMatch('[\\d\\w]{8}')

      it 'must return password with at least 2 digits', ->
        password_wizard = new PasswordWizard()
        password_wizard.add_candidate(PasswordWizard.CASE_ALPHANUMBERS)
        rule = [ PasswordFrequencyChecker, PasswordWizard.DIGITS, 2 ]
        password_wizard.add_rule(rule...)
        password = password_wizard.generate()
        expect(password).toMatch('[\\d\\w]{8}')
        watchdog = new PasswordWatchdog(password, [ rule ])
        expect(watchdog.test()).toBeTruthy()

