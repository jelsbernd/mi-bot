# Description:
#   Have Hubot remind you to do Builds.
#   hh:mm must be in the same timezone as the server Hubot is on. Probably UTC.
#
#   This is configured to work for Hipchat. You may need to change the 'create
#   Build' command to match the adapter you're using.
#
# Configuration:
#  HUBOT_Build_PREPEND
#
# Commands:
#   hubot Build help - See a help document explaining how to use.
#   hubot create Build hh:mm - Creates a Build at hh:mm every weekday for this room
#   hubot create Build hh:mm at location/url - Creates a Build at hh:mm (UTC) every weekday for this chat room with a reminder for a physical location or url
#   hubot create Build Monday@hh:mm - Creates a Build at hh:mm every Monday for this room
#   hubot create Build hh:mm UTC+2 - Creates a Build at hh:mm every weekday for this room (relative to UTC)
#   hubot create Build Monday@hh:mm UTC+2 - Creates a Build at hh:mm every Monday for this room (relative to UTC)
#   hubot list Builds - See all Builds for this room
#   hubot list all Builds - See all Builds in every room
#   hubot delete Build hh:mm - If you have a Build on weekdays at hh:mm, delete it. Can also supply a weekday and/or UTC offset
#   hubot delete all Builds - Deletes all Builds for this room.
#
# Dependencies:
#   underscore
#   cron

# The MIT License (MIT)

# Copyright (c) 2014 Shaun Donnelly

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.



###jslint node: true###

cronJob = require('cron').CronJob
_ = require('underscore')

module.exports = (robot) ->
  # Compares current time to the time of the Build to see if it should be fired.


  # Returns all Builds.
  getBuilds = ->
    robot.brain.get('Builds') or []

  # Returns just Builds for a given room.
  getBuildsForRoom = (room) ->
    _.where getBuilds(), room: room



  # Finds the room for most adaptors
  @findRoom = (msg) ->
    room = msg.envelope.room
    if _.isUndefined(room)
      room = msg.envelope.user.reply_to
    room

  # Confirm a time is in the valid 00:00 format
  timeIsValid = (time) ->
    validateTimePattern = /([01]?[0-9]|2[0-4]):[0-5]?[0-9]/
    return validateTimePattern.test time

  # Stores a Build in the brain.
  saveBuild = (room, dayOfWeek, time, utcOffset, location, msg) ->
    if !timeIsValid time
      msg.send "Sorry, but I couldn't find a time to create the Build at."
      return

    Builds = getBuilds()
    newBuild =
      room: room
      dayOfWeek: dayOfWeek
      time: time
      utc: utcOffset
      location: location.trim()
    Builds.push newBuild
    updateBrain Builds
    displayDate = dayOfWeek or 'weekday'
    msg.send 'Ok, from now on I\'ll remind this room to do a Build every ' + displayDate + ' at ' + time + (if location then location else '')
    return

  # triggers monitoring a Build in the brain.
  @monitorBuild = (room, name, msg) ->

    Builds = getBuilds()
    newBuild =
      room: room
      name: name
    Builds.push newBuild
    updateBrain Builds
    msg.send 'Noted. Now monitoring ' + name
    return    

  # Updates the brain's Build knowledge.
  updateBrain = (Builds) ->
    robot.brain.set 'Builds', Builds
    return

  # Remove all Builds for a room
  @clearAllBuildsForRoom = (room, msg) ->
    Builds = getBuilds()
    BuildsToKeep = _.reject(Builds, room: room)
    updateBrain BuildsToKeep
    BuildsCleared = Builds.length - (BuildsToKeep.length)
    msg.send 'Deleted ' + BuildsCleared + ' Builds for ' + room
    return

  # Remove specific Builds for a room
  clearSpecificBuildForRoom = (room, time, msg) ->
    if !timeIsValid time
      msg.send "Sorry, but I couldn't spot a time in your command."
      return

    Builds = getBuilds()
    BuildsToKeep = _.reject(Builds,
      room: room
      time: time)
    updateBrain BuildsToKeep
    BuildsCleared = Builds.length - (BuildsToKeep.length)
    if BuildsCleared == 0
      msg.send 'Nice try. You don\'t even have a Build at ' + time
    else
      msg.send 'Deleted your ' + time + ' Build.'
    return

  # Responsd to the help command
  sendHelp = (msg) ->
    message = []
    message.push 'I can remind you to do your Builds!'
    message.push 'Use me to create a Build, and then I\'ll post in this room at the times you specify. Here\'s how:'
    message.push ''
    message.push robot.name + ' create Build hh:mm - I\'ll remind you to Build in this room at hh:mm every weekday.'
    message.push robot.name + ' create Build hh:mm UTC+2 - I\'ll remind you to Build in this room at hh:mm UTC+2 every weekday.'
    message.push robot.name + ' create Build hh:mm at location/url - Creates a Build at hh:mm (UTC) every weekday for this chat room with a reminder for a physical location or url'
    message.push robot.name + ' create Build Monday@hh:mm UTC+2 - I\'ll remind you to Build in this room at hh:mm UTC+2 every Monday.'
    message.push robot.name + ' monitor Build name - Activate monitoring for this build.'
    message.push robot.name + ' list Builds - See all Builds for this room.'
    message.push robot.name + ' list all Builds- Be nosey and see when other rooms have their Build.'
    message.push robot.name + ' delete Build hh:mm - If you have a Build at hh:mm, I\'ll delete it.'
    message.push robot.name + ' delete all Builds - Deletes all Builds for this room.'
    msg.send message.join('\n')
    return

  # List the Builds within a specific room
  @listBuildsForRoom = (room, msg) ->
    Builds = getBuildsForRoom(findRoom(msg))
    if Builds.length == 0
      msg.send 'Well this is awkward. You haven\'t got any Builds set :-/'
    else
      BuildsText = [ 'Here\'s your Builds:' ].concat(_.map(Builds, (Build) ->
        text =  'Name: ' + Build.name
        text
      ))
      msg.send BuildsText.join('\n')
    return

  listBuildsForAllRooms = (msg) ->
    Builds = getBuilds()
    if Builds.length == 0
      msg.send 'No, because there aren\'t any.'
    else
      BuildsText = [ 'Here\'s the Builds for every room:' ].concat(_.map(Builds, (Build) ->
        text =  'Room: ' + Build.room + ', Time: ' + Build.time
        if Build.utc
          text += ' UTC' + Build.utc
        if Build.location
          text +=', Location: '+ Build.location
        text
      ))
      msg.send BuildsText.join('\n')
    return

  'use strict'
  # Constants.
  Build_MESSAGES = [
    'Build time!'
    'Time for Build, y\'all.'
    'It\'s Build time once again!'
    'Get up, stand up (it\'s time for our Build)'
    'Build time. Get up, humans'
    'Build time! Now! Go go go!'
  ]
  PREPEND_MESSAGE = process.env.HUBOT_Build_PREPEND or ''
  if PREPEND_MESSAGE.length > 0 and PREPEND_MESSAGE.slice(-1) != ' '
    PREPEND_MESSAGE += ' '

  # Check for Builds that need to be fired, once a minute
  # Monday to Friday.
  # new cronJob('1 * * * * 1-5', checkBuilds, null, true)

  # robot.hear /monitor (.*)/i, (msg) ->
  #   # msg.send "monitor? MONITOR? WE DON'T NEED NO STINKIN MONITOR"
  #   name = escape(msg.match[1])
  #   room = findRoom msg
  #   monitorBuild room, name, msg

  # robot.hear /clear/i, (msg) ->
  #   msg.send "clear? LIST? Okay."
  #   room = findRoom msg
  #   clearAllBuildsForRoom room, msg
  

  # robot.hear /list/i, (msg) ->
  #   msg.send "list? LIST? Okay."
  #   room = findRoom msg
  #   listBuildsForRoom room, msg
  

  robot.hear /justatest/i, (msg) ->
    msg.send "list? LIST? Okay."
    room = findRoom msg
    listBuildsForRoom room, msg
  

  # Global regex should match all possible options
  # robot.respond /(.*?)builds? ?(?:([A-z]*)\s?\@\s?)?((?:[01]?[0-9]|2[0-4]):[0-5]?[0-9])?(?: UTC([- +]\d\d?))?(.*)/i, (msg) ->
  #   action = msg.match[1].trim().toLowerCase()
  #   dayOfWeek = msg.match[2]
  #   name = msg.match[2]
  #   time = msg.match[3]
  #   utcOffset = msg.match[4]
  #   location = msg.match[5]
  #   room = findRoom msg

  #   switch action
  #     when 'create' then saveBuild room, dayOfWeek, time, utcOffset, location, msg
  #     when 'monitor' then monitorBuild room, name, msg
  #     when 'list' then listBuildsForRoom room, msg
  #     when 'list all' then listBuildsForAllRooms msg
  #     when 'delete' then clearSpecificBuildForRoom room, time, msg
  #     when 'delete all' then clearAllBuildsForRoom room, msg
  #     else sendHelp msg
  #   return

return