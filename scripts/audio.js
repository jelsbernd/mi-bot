// Description:
//    Darth Vader voice audio and Jenkins build light monitor via Slack channel 
//
// Dependencies:
//   TBD
//
// Configuration:
//   TBD
//
// Commands:
//   vader xxx  ?  - returns lights and sounds
//

var shell = require('shelljs');
var eyes_on = true;
var sounds_on = true;
var comms_on = true;
var message = "I'm speechless";
var soundfile = "./sounds/breath.mp3";
var track_dir = "./sounds/"
var player = "mpg123 ";
var mp3Duration = require('mp3-duration');
var wink_len = 0;
var dur = 0;
var mp3dur = 0;
var blinkstick = require('blinkstick');
device = blinkstick.findFirst();


// lights Blinkstick physical device from system hosting hubot
function eye_flash(track) {
    if (eyes_on) {
        dur = 2.88;
        mp3dur = 0;
        ms_time = 0;

        mp3dur = dur * 1000;
        while (ms_time <= mp3dur) {
            console.log("mp3dur", mp3dur);
            wink_len = 0;
            while (wink_len <= mp3dur) {
                wink = Math.floor(Math.random() * 50) + 50;
                // wink = 50;
                device.setColor("#FF0000", { 'channel': 0, 'index': 0 });
                device.setColor("#FF0000", { 'channel': 0, 'index': 1 });
                device.setColor("#FF0000", { 'channel': 0, 'index': 2 });
                device.setColor("#FF0000", { 'channel': 0, 'index': 3 });
                device.setColor("#FF0000", { 'channel': 0, 'index': 4 });
                device.setColor("#FF0000", { 'channel': 0, 'index': 5 });
                device.setColor("#FF0000", { 'channel': 0, 'index': 6 });
                device.setColor("#FF0000", { 'channel': 0, 'index': 7 });
                wink_len += wink;
            }
            wink_len = 0;
            while (wink_len <= mp3dur) {
                // wink = Math.floor(Math.random() * 250) + 50;
                wink = 50;
                device.setColor("#000000", { 'channel': 0, 'index': 0 });
                device.setColor("#000000", { 'channel': 0, 'index': 1 });
                device.setColor("#000000", { 'channel': 0, 'index': 2 });
                device.setColor("#000000", { 'channel': 0, 'index': 3 });
                device.setColor("#000000", { 'channel': 0, 'index': 4 });
                device.setColor("#000000", { 'channel': 0, 'index': 5 });
                device.setColor("#000000", { 'channel': 0, 'index': 6 });
                device.setColor("#000000", { 'channel': 0, 'index': 7 });
                wink_len += wink;
            }
            ms_time += 500;
        }
    }
}

// quiet, do nothing function
function shhhh() {
}

// plays mp3 files from physical device hosting hubot
function say(track) {
    if (sounds_on) {
        shell.exec(player + track_dir + track, { async: true, silent: true });
        eye_flash(track_dir + track);
    }

}

// chats a response to the chosen chat interface i.e. Slack, Yammer, etc.
function chat_it(passed_msg, conversation) {
    comms_on ? passed_msg.send(conversation) : shhhh();
}

module.exports = function (robot) {

    robot.hear(/vader commands/igm, function (msg) {
        msg.send("eyes on\
                  eyes off\
                  speech on\
                  speech off\
                  comms on\
                  comms off\
                  dont fail\
                  build pass");
    });

    robot.hear(/vader eyes on/igm, function (msg) {
        eyes_on = true;
        chat_it(msg, "Here's looking at you");
        say("as_wish.mp3");
    });

    robot.hear(/vader eyes off/igm, function (msg) {
        eyes_on = false;
        chat_it(msg, "I'm resting my eyes");
        say("as_wish.mp3");
    });

    robot.hear(/vader speech on/igm, function (msg) {
        sounds_on = true;
        chat_it(msg, "making noise");
        say("as_wish.mp3");
    });

    robot.hear(/vader speech off/igm, function (msg) {
        sounds_on = false;
        chat_it(msg, "silent running");
        say("as_wish.mp3");
    });

    robot.hear(/vader comms on/igm, function (msg) {
        comms_on = true;
        chat_it(msg, "engage chatter");
        say("as_wish.mp3");
    });

    robot.hear(/vader comms off/igm, function (msg) {
        comms_on = false;
        chat_it(msg, "cutting out the chatter");
        say("as_wish.mp3");
    });

    robot.hear(/vader dont fail/igm, function (msg) {
        say("dontfail.mp3");
    });

    robot.hear(/vader build pass/igm, function (msg) {
        // chat_it(msg, "Impressive");
        say("proud.mp3");
    });

    robot.hear(/Git push detected/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("pushit.mp3");
    });

    robot.hear(/vader breath/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("breath.mp3");
    });
    robot.hear(/vader disintigrate/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("dsntgrt.mp3");
    });
    robot.hear(/vader all to easy/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("all2easy.mp3");
    });
    robot.hear(/vader waiting/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("waiting.mp3");
    });
    robot.hear(/vader power/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("power.mp3");
    });
    robot.hear(/vader no escape/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("noescap.mp3");
    });
    robot.hear(/vader impressive/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("impresiv.mp3");
    });
    robot.hear(/vader bidding/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("bidding.mp3");
    });
    robot.hear(/vader honored/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("honored.mp3");
    });
    robot.hear(/vader force/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("theforce.mp3");
    });
}