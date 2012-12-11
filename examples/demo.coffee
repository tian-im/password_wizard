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

    set: (property, value) ->
      switch property
        when 'type_safe' then value = value.match(/true|t/i)?
        when 'digits_checker_length', 'letters_checker_length', 'symbols_checker_length', 'length', 'samples'
          value = undefined if value == ''
      if property == 'candidates'
        @candidates = value
      else
        eval "this.#{ property } = #{ value }"

    eq: (other) ->
      return false unless other?
      for property in [ 'candidates', 'type_safe', 'digits_checker_length', 'letters_checker_length', 'symbols_checker_length', 'length' ]
        return false unless eval "other.#{ property } == this.#{ property }"
      true

    execute: ->
      pw = new PasswordWizard()
      pw.length(@length)
      pw.candidates = @candidates

      pw.add_rule DigitsFrequencyChecker,    @digits_checker_length  if @digits_checker_length?
      pw.add_rule AlphabetsFrequencyChecker, @letters_checker_length if @letters_checker_length?
      pw.add_rule SymbolsFrequencyChecker,   @symbols_checker_length if @symbols_checker_length?

      pw.generate() for len in [ 1..@samples ]

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

      # check the checkbox if they share the same configuration
      for item in [ '#four_digits_pin', '#three_dices', '#hex_color' ]
        $item = $(item)
        return $item.prop('checked', true) if strategy.eq $item.data('strategy')
      $('#general').prop('checked', true)

    @update: (property, value) ->
      strategy = @strategy()
      strategy.set property, value
      @reload(strategy)

    @strategy: ->
      $('#general').data('strategy')

    @remove_candidates: (str) ->
      candidates = $('#custom').val().replace(new RegExp("[#{ str }]", 'g'), '')
      @update 'candidates', candidates

    @add_candidates: (str) ->
      candidates = str + $('#custom').val().replace(new RegExp("[#{ str }]", 'g'), '')
      @update 'candidates', candidates

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

      $('#digits').change ->
        if $(@).is(':checked')
          self.add_candidates(PasswordWizard.DIGITS)
        else
          self.remove_candidates(PasswordWizard.DIGITS)

      $('#letters').change ->
        if $(@).is(':checked')
          self.add_candidates(PasswordWizard.DOWNCASE_ALPHABETS)
        else
          self.remove_candidates(PasswordWizard.DOWNCASE_ALPHABETS)

      $('#uppercase_letters').change ->
        if $(@).is(':checked')
          self.add_candidates(PasswordWizard.UPCASE_ALPHABETS)
        else
          self.remove_candidates(PasswordWizard.UPCASE_ALPHABETS)

      $('#symbols').change ->
        if $(@).is(':checked')
          self.add_candidates(PasswordWizard.SYMBOLS)
        else
          candidates = PasswordWizard.SYMBOLS.replace(/([\.\[\]\\\(\)\?\$\^\+\*])/g, '\\$1')
          self.remove_candidates(candidates)

      $('#type_safe').change ->
        if $(@).is(':checked')
          candidates = PasswordWizard.TYPE_SAFES.replace(/([\.\[\]\\\(\)\?\$\^\+\*])/g, '\\$1')
          self.remove_candidates(candidates)

      # strategies
      $('#four_digits_pin').data('strategy', new FourDigitsPINStrategy())
      $('#three_dices').data('strategy', new ThreeDicesStrategy())
      $('#hex_color').data('strategy', new HEXColorStrategy())

      $('#four_digits_pin, #three_dices, #hex_color').click ->
        $('#general').data 'strategy', $.extend({}, $(@).data('strategy'))

      $('#general').click ->
        $(@).data 'strategy', new PasswordWizardStrategy()

      $('input[name=purpose]').click ->
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
