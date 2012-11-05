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
  constructor: (@length = PasswordWizard.DEFAULT_LENGTH, @candidate_array = [ PasswordWizard.CASE_ALPHANUMBERS ]) ->
    @candidate_array = [ @candidate_array ] if (typeof @candidate_array) is 'string'
    @candidates = @candidate_array.join('')

  position: ->
    Math.floor(Math.random() * @candidates.length)

  one_char: (position) ->
    @candidates.charAt(@position())

  run: ->
    result = (@one_char() for len in [ 1..@length ])
    result.join('')

class window.PasswordFrequencyChecker
  constructor: (@password, @candidate_array, @frequency) ->
    @candidate_array = [ @candidate_array ] if (typeof @candidate_array) is 'string'
    @pattern = new RegExp("[#{ @candidate_array.join('') }]", RegExp.global)

  run: ->
    password_phrase = @password
    for frequency in [ 1..@frequency ]
      return false if (position = password_phrase.search(@pattern)) < 0
        # cut the string and get ready for the next search
      password_phrase = password_phrase.substring(position + 1)
    true

class window.PasswordWatchdog
  constructor: (@password, @rules = []) ->

  test: ->
    return false unless @password
    for rule in @rules
      return false unless new rule[0](@password, rule.slice(1)...).run()
    true

class window.PasswordWizard
  @title:             'Password Wizard'
  @version:           '0.0.1'
  @DIGITS:            '0123456789'
  @ALPHABETS:         'zxcvbqwertasdfgyuiophjklnm'
  @SYMBOLS:           '~`!@#$%^&*()-_+={[}]|\\:;"\'<,>.?/'
  @UPCASE_ALPHABETS:  @ALPHABETS.toUpperCase()
  @ALPHANUMBERS:      @DIGITS + @ALPHABETS
  @CASE_ALPHABETS:    @ALPHABETS + @UPCASE_ALPHABETS
  @CASE_ALPHANUMBERS: @ALPHANUMBERS + @UPCASE_ALPHABETS

  @DEFAULT_LENGTH:    8

  length: (length = undefined) ->
    if length?
      @len = length
      @
    else
      @len ?= PasswordWizard.DEFAULT_LENGTH

  rules: [
    # [ PasswordFrequencyChecker, PasswordWizard.DIGITS, 2 ]
    # [ PasswordFrequencyChecker, PasswordWizard.CASE_ALPHABETS, 2 ]
  ]

  add_rule: (checker, args...) ->
    @rules.push([ checker, args... ])

  candidates: []

  add_candidate: (candidate) ->
    @candidates.push(candidate)

  generate: ->
    password = new PasswordGenerator(@len, @candidates).run() until new PasswordWatchdog(password, @rules).test()
    password
