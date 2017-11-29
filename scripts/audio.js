// Description:
//   holiday detector script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot is it weekend ?  - returns whether is it weekend or not
//   hubot is it holiday ?  - returns whether is it holiday or not

var shell = require('shelljs');
var eyes_on = true;
var sounds_on = true;
var comms_on = true;
var message = "I'm speechless";
var soundfile = "./sounds/breath.mp3";
var player = "mpg123 ";
var mp3Duration = require('mp3-duration');
var wink_len = 0;
var duration = 0;
var mp3dur = 0;



function eye_flash(passed_msg, track) {
    mp3Duration(track, function (err, duration) {
        if (err) return console.log(err.message);
        console.log('Your file is ' + duration + ' seconds long');
        mp3dur = duration * 1000;
    });
    // if (eyes_on) {
    // determine mp3 length in ms for use in eye blink duration
    // new Promise(mp3Duration(track, function (err, duration) {
    //     .then
    //     if (err) duration = 2;

    console.log('Your duration is ' + mp3dur + ' seconds long');
    // chat_it(passed_msg, "duration buoy = " + mp3dur);
    // }
    wink_len = 0;
    // mp3dur = duration;
    // .then mp3dur = promise.duration;
    // chat_it(passed_msg, mp3dur);
    while (wink_len <= mp3dur) {
        wink = Math.floor(Math.random() * 200) + 50;
        // chat_it(passed_msg, "wink = " + wink);
        shell.exec('blinkstick --pulse red --repeat 1 --duration=' + wink, { async: false, silent: true });
        // wink_len += 1000;
        wink_len += wink;
        // chat_it(passed_msg, "wink_len = " + wink_len);
    }
}


// quiet, do nothing function
function shhhh() {
}

// plays mp3 files from physical device hosting hubot
function say(track) {
    sounds_on ? shell.exec(player + track, { async: true, silent: true }) : shhhh();
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
        say("./sounds/as_wish.mp3");
    });

    robot.hear(/vader eyes off/igm, function (msg) {
        eyes_on = false;
        chat_it(msg, "I'm resting my eyes");
        say("./sounds/as_wish.mp3");
    });

    robot.hear(/vader speech on/igm, function (msg) {
        sounds_on = true;
        chat_it(msg, "making noise");
        say("./sounds/as_wish.mp3");
    });

    robot.hear(/vader speech off/igm, function (msg) {
        sounds_on = false;
        chat_it(msg, "silent running");
        say("./sounds/as_wish.mp3");
    });

    robot.hear(/vader comms on/igm, function (msg) {
        comms_on = true;
        chat_it(msg, "engage chatter");
        say("./sounds/as_wish.mp3");
    });

    robot.hear(/vader comms off/igm, function (msg) {
        comms_on = false;
        chat_it(msg, "cutting out the chatter");
        say("./sounds/as_wish.mp3");
    });

    robot.hear(/vader dont fail/igm, function (msg) {
        shell.exec('mpg123 ./sounds/dontfail.mp3', { async: true, silent: true });
        shell.exec('blinkstick --pulse red --repeat 3 --duration=50', { async: false, silent: true });
        shell.exec('blinkstick --pulse red --repeat 2 --duration=100', { async: false, silent: true });
        shell.exec('blinkstick --pulse red --repeat 10 --duration=500', { async: true, silent: true });
        msg.send();
    });

    robot.hear(/vader build pass/igm, function (msg) {
        // chat_it(msg, "Impressive");
        say("./sounds/proud.mp3");
        eye_flash(msg, "./sounds/proud.mp3");
        // shell.exec('blinkstick --pulse red --repeat 1 --duration=500', { async: true, silent: true });
    });

    robot.hear(/Git push detected/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say("./sounds/pushit.mp3");
        eye_flash(msg, "./sounds/pushit.mp3");
    });
}