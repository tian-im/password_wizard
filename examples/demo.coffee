jQuery ($) ->
  $('h1.title').text("#{ PasswordWizard.TITLE } #{ PasswordWizard.VERSION }")

  # presenter
  class window.PasswordWizardStrategy
    constructor: ->
      @candidates = PasswordWizard.ALPHANUMBERS
      @type_safe = false
      @digits_checker_length = 2
      @letters_checker_length = 2
      @symbols_checker_length = undefined
      @length = 8
      @samples = 10

    execute: ->
      pw = new PasswordWizard()
      pw.length(@length)
      pw.candidates = @candidates

      pw.add_rule DigitsFrequencyChecker,    @digits_checker_length if @digits_checker_length?
      pw.add_rule AlphabetsFrequencyChecker, @letters_checker_length if @letters_checker_length?
      pw.add_rule SymbolsFrequencyChecker,   @symbols_checker_length if @symbols_checker_length?

      pw.generate() for len in [ 1..@samples ]

    set: (property, value) ->
      switch property
        when 'type_safe' then value = value == 'true'
        when 'digits_checker_length', 'letters_checker_length', 'symbols_checker_length', 'length', 'samples'
          if value == ''
            value = undefined
      if property == 'candidates'
        @candidates = value
      else
        eval "this.#{ property } = #{ value }"

    eq: (other) ->
      return false unless other?
      for property in [ 'candidates', 'type_safe', 'digits_checker_length', 'letters_checker_length', 'symbols_checker_length', 'length' ]
        return false unless eval "other.#{ property } == this.#{ property }"
      true

  class window.FourDigitsPINStrategy extends PasswordWizardStrategy
    constructor: ->
      super
      @candidates = PasswordWizard.DIGITS
      @digits_checker_length = 4
      @letters_checker_length = undefined
      @length = 4

  class window.ThreeDicesStrategy extends PasswordWizardStrategy
    constructor: ->
      super
      @candidates= '123456'
      @digits_checker_length= 3
      @letters_checker_length= undefined
      @length= 3

  class window.HEXColorStrategy extends PasswordWizardStrategy
    constructor: ->
      super
      @candidates = '0123456789ABCDEF'
      @digits_checker_length = undefined
      @letters_checker_length = undefined
      @length = 6

  # logics
  class window.PasswordWizardManager
    @include: (source, str) ->
      for i in [ 0...str.length ]
        return false if source.indexOf(str.charAt(i)) < 0
      true

    @exclude: (source, str) ->
      for i in [ 0...str.length ]
        return false if source.indexOf(str.charAt(i)) >= 0
      true

    @reload: (strategy) ->
      strategy ?= @strategy()
      # $('#general').data('strategy', strategy)
      $('#custom').val(strategy.candidates)
      $('#digits').prop('checked', @include(strategy.candidates, PasswordWizard.DIGITS))
      $('#letters').prop('checked', @include(strategy.candidates, PasswordWizard.DOWNCASE_ALPHABETS))
      $('#uppercase_letters').prop('checked', @include(strategy.candidates, PasswordWizard.UPCASE_ALPHABETS))
      $('#symbols').prop('checked', @include(strategy.candidates, PasswordWizard.SYMBOLS))
      $('#type_safe').prop('checked', @exclude(strategy.candidates, PasswordWizard.TYPE_SAFES))
      
      $('#digits_checker_length').val(strategy.digits_checker_length)
      $('#letters_checker_length').val(strategy.letters_checker_length)
      $('#symbols_checker_length').val(strategy.symbols_checker_length)

      $('#password_length').val(strategy.length)
      $('#password_samples').val(strategy.samples)

      for item in [ '#four_digits_pin', '#three_dices', '#hex_color' ]
        if strategy.eq ($item = $(item)).data('strategy')
          # switch to use same one
          return $item.prop('checked', true).data('strategy')
      $('#general').prop('checked', true).data('strategy', strategy)

    @update: (property, value) ->
      strategy = @strategy()
      strategy.set property, value
      @reload(strategy)

    @strategy: ->
      # current
      strategy = $('input[name=purpose]:checked').data('strategy')
      strategy ?= $('#general').data('strategy') # default

    @remove_candidates: (str) ->
      strategy = @strategy()
      strategy.candidates = strategy.candidates.replace(new RegExp("[#{ str }]", 'g'), '')
      @reload(strategy)

    @add_candidates: (str) ->
      strategy = @strategy()
      strategy.candidates = str + strategy.candidates.replace(new RegExp("[#{ str }]", 'g'), '')
      @reload(strategy)

    @init: ->
      self = @
      # event setup
      $('#custom').change ->
        self.update('candidates', $(@).val())

      $('#password_length').change ->
        self.update('length', $(@).val())

      $('#password_samples').change ->
        self.update('samples', $(@).val())

      $('#digits_checker_length').change ->
        self.update('digits_checker_length', $(@).val())

      $('#letters_checker_length').change ->
        self.update('letters_checker_length', $(@).val())

      $('#symbols_checker_length').change ->
        self.update('symbols_checker_length', $(@).val())

      for pairs in [
        [ '#digits', PasswordWizard.DIGITS ]
        [ '#letters', PasswordWizard.DOWNCASE_ALPHABETS ]
        [ '#uppercase_letters', PasswordWizard.UPCASE_ALPHABETS ]
        [ '#symbols', PasswordWizard.SYMBOLS ]
      ]
        $(pairs[0]).change ->
          if $(@).is(':checked')
            self.add_candidates(pairs[1])
          else
            self.remove_candidates(pairs[1])


      # strategies
      # $('#general').data 'strategy', new PasswordWizardStrategy()
      $('#four_digits_pin').data 'strategy', new FourDigitsPINStrategy()
      $('#three_dices').data 'strategy', new ThreeDicesStrategy()
      $('#hex_color').data 'strategy', new HEXColorStrategy()

      $('#general').change ->
        $(@).data 'strategy', new PasswordWizardStrategy()

      $('input[name=purpose]').change ->
        self.reload()

      $('button.btn').click -> # generate button
        passwords = self.strategy().execute()
        $('#result').empty()
        $.map passwords, (p) ->
          $('#result').append $('<div />').addClass('sample').text(p)

      # actions
      $('#general').click()
      $('button.btn').click()

  PasswordWizardManager.init()
