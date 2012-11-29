###
 * Password Wizard v0.0.1
 * @summary generate the password using different set of chars and rules
 * @source_code https://github.com/chentianwen/password_wizard
 *
 * @copyright 2011, Tianwen Chen
 * @website https://github.tian.im
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
###

"use_strict"

class window.PasswordGenerator
  # @param length     [ Integer ] length of the password
  # @param candidates [ String, Array ] character candidates, could be string or array of string
  constructor: (@length = PasswordWizard.DEFAULT_LENGTH, @candidates = PasswordWizard.ALPHANUMBERS) ->
    @candidates = @candidates.join('') if @candidates instanceof Array

  one_char: ->
    @candidates.charAt(Math.floor(Math.random() * @candidates.length))

  generate: ->
    result = (@one_char() for len in [ 1..@length ])
    result.join('')

class window.PasswordFrequencyChecker
  # @param candidates [ String, Array ] character candidates, could be string or array of string
  # @param frequency  [ Integer ] minimum occurance frequency
  constructor: (@candidates, @frequency) ->
    @candidates = @candidates.join('') if @candidates instanceof Array
    @pattern = new RegExp("[#{ @candidates }]", RegExp.global)

  check: (password)->
    password_phrase = password
    for frequency in [ 1..@frequency ]
      return false if (position = password_phrase.search(@pattern)) < 0
        # slice the string to get ready for the next test
      password_phrase = password_phrase.substring(position + 1)
    true

class window.DigitsFrequencyChecker extends PasswordFrequencyChecker
  constructor: (frequency) ->
    super PasswordWizard.DIGITS, frequency

class window.AlphabetsFrequencyChecker extends PasswordFrequencyChecker
  constructor: (frequency) ->
    super PasswordWizard.ALPHABETS, frequency

class window.SymbolsFrequencyChecker extends PasswordFrequencyChecker
  constructor: (frequency) ->
    super PasswordWizard.SYMBOLS, frequency

class window.PasswordWatchdog
  # @param rules [ Array ]
  # @example Rules will be the following format
  #     [ [ DigitsFrequencyChecker, 2 ] ]
  #     [ [ PasswordFrequencyChecker, '0123456', 10 ] ]
  constructor: (@rules = []) ->
    @rules = (new rule[0](rule.slice(1)...) for rule in @rules)

  test: (password)->
    return false unless password?
    (return false unless rule.check(password)) for rule in @rules
    true

class window.PasswordWizard
  @TITLE:                   'Password Wizard'
  @VERSION:                 '0.0.1'

  @DIGITS:                  '0123456789'
  @DOWNCASE_ALPHABETS:      'abcdefghijklmnopqrstuvwxyz'
  @SYMBOLS:                 '~`!@#$%^&*()-_+={[}]|\\:;"\'<,>.?/'

  @UPCASE_ALPHABETS:        @DOWNCASE_ALPHABETS.toUpperCase()
  @DOWNCASE_ALPHANUMBERS:   @DOWNCASE_ALPHABETS + @DIGITS

  @ALPHABETS:               @DOWNCASE_ALPHABETS + @UPCASE_ALPHABETS
  @ALPHANUMBERS:            @DOWNCASE_ALPHANUMBERS + @UPCASE_ALPHABETS

  @TYPE_SAFES:              'iIl1|oO0'

  @DEFAULT_LENGTH:          8
  @MAX_ATTAMPTS:            88

  constructor: ->
    @rules = []
    @candidates = []

  length: (length = undefined) ->
    if length?
      @len = length
      @
    else
      @len ?= PasswordWizard.DEFAULT_LENGTH

  add_rule: (checker, args...) ->
    @rules.push([ checker, args... ])

  add_candidate: (candidate) ->
    @candidates.push(candidate)

  generate: ->
    attampts = 0
    watchdog = new PasswordWatchdog(@rules)
    # unless the test passes
    until watchdog.test(password)
      # or max attampts reaches
      return '' if attampts++ >= PasswordWizard.MAX_ATTAMPTS
      password = new PasswordGenerator(@len, @candidates).generate()
    password
