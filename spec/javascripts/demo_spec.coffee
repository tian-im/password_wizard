jQuery ($) ->
  set_input = (id, type = 'text', name = '') ->
    """
    <input type="#{ type }" id="#{ id }" name="#{ name }"/>
    """

  # fixtures
  set_fixtures = ->
    f = """
        #{ set_input 'general',           'radio', 'purpose' }
        #{ set_input 'four_digits_pin',   'radio', 'purpose' }
        #{ set_input 'three_dices',       'radio', 'purpose' }
        #{ set_input 'hex_color',         'radio', 'purpose' }

        #{ set_input 'custom' }
        #{ set_input 'digits',            'checkbox' }
        #{ set_input 'letters',           'checkbox' }
        #{ set_input 'uppercase_letters', 'checkbox' }
        #{ set_input 'symbols',           'checkbox' }

        #{ set_input 'digits_checker_length' }
        #{ set_input 'letters_checker_length' }
        #{ set_input 'symbols_checker_length' }

        #{ set_input 'password_length' }
        #{ set_input 'password_samples' }
        """
    setFixtures f

  # $context = $('#jasmine-fixtures')

  # test cases
  describe 'PasswordWizardStrategy', ->
    describe '#execute', ->
      it 'must return an array of strings which are the same size as the sample specified', ->
        strategy = new PasswordWizardStrategy()
        strategy.samples = 12
        expect(strategy.execute().length).toEqual(12)

    describe '#set', ->
      it 'must format the value and set the type_safe as true', ->
        strategy = new PasswordWizardStrategy()
        strategy.set 'type_safe', 't'
        expect(strategy.type_safe).toBeTruthy()
        strategy.set 'type_safe', 'true'
        expect(strategy.type_safe).toBeTruthy()
        strategy.set 'type_safe', 'TRUE'
        expect(strategy.type_safe).toBeTruthy()

      it 'must format the value and set the type_safe as true', ->
        strategy = new PasswordWizardStrategy()
        strategy.set 'type_safe', 'f'
        expect(strategy.type_safe).toBeFalsy()
        strategy.set 'type_safe', 'false'
        expect(strategy.type_safe).toBeFalsy()
        strategy.set 'type_safe', 'FALSE'
        expect(strategy.type_safe).toBeFalsy()
        strategy.set 'type_safe', ''
        expect(strategy.type_safe).toBeFalsy()

      for property in [ 'digits_checker_length', 'letters_checker_length', 'symbols_checker_length', 'length', 'samples' ]
        it "must format the value and set the #{ property } accordingly", ->
          strategy = new PasswordWizardStrategy()
          strategy.set property, ''
          expect(eval("strategy.#{ property }")).toBeUndefined()
          strategy.set property, '11'
          expect(eval("strategy.#{ property }")).toEqual(11)

      it 'must assign the candidates correctly', ->
        strategy = new PasswordWizardStrategy()
        strategy.set 'candidates', undefined
        expect(strategy.candidates).toBeUndefined()
        strategy.set 'candidates', ''
        expect(strategy.candidates).toEqual('')
        strategy.set 'candidates', 'abc1234'
        expect(strategy.candidates).toEqual('abc1234')

    describe '#eq', ->
      it 'must return true if all properties equal when they are instances of the same class', ->
        strategy = new PasswordWizardStrategy()
        strategy2 = new PasswordWizardStrategy()

        expect(strategy.eq(strategy2)).toBeTruthy()

      it 'must return true if all properties equal when they are instances of the different class', ->
        strategy = new PasswordWizardStrategy()
        strategy.candidates = PasswordWizard.DIGITS
        strategy.digits_checker_length = 4
        strategy.letters_checker_length = undefined
        strategy.length = 4
        strategy2 = new FourDigitsPINStrategy()

        expect(strategy.eq(strategy2)).toBeTruthy()

      it 'must return false if the comparing object is undefined', ->
        strategy = new PasswordWizardStrategy()
        expect(strategy.eq(undefined)).toBeFalsy()

      it 'must return false if any of the properties is not the same', ->
        strategy = new PasswordWizardStrategy()
        properties = [
          [ 'candidates', 'something else' ]
          [ 'type_safe', 'true' ]
          [ 'digits_checker_length', '1000' ]
          [ 'letters_checker_length', '1000' ]
          [ 'symbols_checker_length', '1000' ]
          [ 'length', '1000' ]
        ]

        for property in properties
          strategy2 = new PasswordWizardStrategy()
          strategy2.set property[0], property[1]
          expect(strategy.eq(strategy2)).toBeFalsy()

      it 'must return true when samples are not the same, even if the samples are not the same', ->
        strategy = new PasswordWizardStrategy()
        strategy2 = new PasswordWizardStrategy()
        strategy2.samples = 11

        expect(strategy.samples).not.toEqual(strategy2.samples)
        expect(strategy.eq(strategy2)).toBeTruthy()

    describe '#execute', ->
      it 'must return an array of strings', ->
        strategy = new PasswordWizardStrategy()
        expect(strategy.execute().length).toEqual(strategy.samples)

  describe 'PasswordWizardManager', ->
    describe '::include', ->
      it 'must return true when string1 contains all chars from string2', ->
        expect(PasswordWizardManager.include('abc1234', 'cb1')).toBeTruthy()
        expect(PasswordWizardManager.include('abc1234', '1234abc')).toBeTruthy()

      it 'must return false when string1 does not contain all chars from string2', ->
        expect(PasswordWizardManager.include('abc1234', '5abc1234')).toBeFalsy()
        expect(PasswordWizardManager.include('abc1234', '5')).toBeFalsy()

    describe '::exclude', ->
      it 'must return true when string1 does not contain any chars from string2', ->
        expect(PasswordWizardManager.exclude('abc1234', '5678')).toBeTruthy()

      it 'must return false when string1 contains any chars from string2', ->
        expect(PasswordWizardManager.exclude('abc1234', '15678')).toBeFalsy()

    describe '::reload', ->
      it 'must set all the values for the general strategy after the init', ->
        set_fixtures()

        PasswordWizardManager.init()
        PasswordWizardManager.reload()

        expect($('#custom').val()).toEqual(PasswordWizard.ALPHANUMBERS)
        expect($('#digits_checker_length').val()).toEqual('2')
        expect($('#letters_checker_length').val()).toEqual('2')
        expect($('#symbols_checker_length').val()).toEqual('')
        expect($('#password_length').val()).toEqual('8')
        expect($('#password_samples').val()).toEqual('10')

        expect($('#digits').is(':checked')).toBeTruthy()
        expect($('#letters').is(':checked')).toBeTruthy()
        expect($('#uppercase_letters').is(':checked')).toBeTruthy()
        expect($('#symbols').is(':checked')).toBeFalsy()
        expect($('#type_safe').is(':checked')).toBeFalsy()

      it 'must set all the values for a specified strategy', ->
        set_fixtures()
        
        PasswordWizardManager.init()
        strategy = new FourDigitsPINStrategy()

        PasswordWizardManager.reload(strategy)

        expect($('#custom').val()).toEqual(PasswordWizard.DIGITS)
        expect($('#digits_checker_length').val()).toEqual('4')
        expect($('#letters_checker_length').val()).toEqual('')
        expect($('#symbols_checker_length').val()).toEqual('')
        expect($('#password_length').val()).toEqual('4')
        expect($('#password_samples').val()).toEqual('10')

        expect($('#digits').is(':checked')).toBeTruthy()
        expect($('#letters').is(':checked')).toBeFalsy()
        expect($('#uppercase_letters').is(':checked')).toBeFalsy()
        expect($('#symbols').is(':checked')).toBeFalsy()
        expect($('#type_safe').is(':checked')).toBeFalsy()

        expect($('input[name=purpose]:checked').is('#four_digits_pin')).toBeTruthy()

    describe '::update', ->
      it 'must update the property accordingly', ->
        set_fixtures()

        PasswordWizardManager.init()
        PasswordWizardManager.update('candidates', '1234')

        expect(PasswordWizardManager.strategy().candidates).toEqual('1234')

    describe '::remove_candidates', ->
      it 'must remove the candidates', ->
        set_fixtures()

        PasswordWizardManager.init()
        PasswordWizardManager.update('candidates', '')
        PasswordWizardManager.remove_candidates(PasswordWizard.DIGITS)

        expect(PasswordWizardManager.strategy().candidates).toEqual('')

    describe '::add_candidates', ->
      it 'must remove the candidates', ->
        set_fixtures()

        PasswordWizardManager.init()
        PasswordWizardManager.update('candidates', '')
        PasswordWizardManager.add_candidates(PasswordWizard.DIGITS)

        expect(PasswordWizardManager.strategy().candidates).toEqual(PasswordWizard.DIGITS)
