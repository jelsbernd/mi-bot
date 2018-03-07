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
// var mp3Duration = require('mp3-duration');
var wink_len = 0;
var dur = 0;
var mp3dur = 0;
var blinkstick = require('blinkstick');
device = blinkstick.findFirst();
// var wait = ms => new Promise((r, j) => setTimeout(r, ms))

// lights Blinkstick physical device from system hosting hubot
function eye_flash(dur, track) {
    if (eyes_on) {
        // var mp3Duration = require('mp3-duration');

        // mp3Duration(track, function (err, duration) {
        //     if (err) return console.log(err.message);
        //     // await wait(2000);
        //     console.log('Your file is ' + duration + ' seconds long');
        // })
        // client.set('joesdur', 2.19);

        // dur = 4
        // dur = client.get('joesdur');
        console.log('dur is' + dur + ' seconds long');
        // dur = await(duration);
        mp3dur = 0;
        ms_time = 0;

        mp3dur = dur * 2750;
        while (ms_time <= mp3dur) {
            // console.log("mp3dur", mp3dur);
            wink_len1 = 0;
            // flash those eyes
            while (wink_len1 <= mp3dur) {
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
                wink_len1 += wink;
                // console.log("wink_len1 top", wink_len1);
            }
            wink_len2 = 0;
            // darken those eyes
            while (wink_len2 <= mp3dur) {
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
                wink_len2 += wink;
                // console.log("wink_len2 bottom", wink_len2);
            }
            ms_time += wink_len1;
        }
    }
}

// quiet, do nothing function
function shhhh() {
}

// plays mp3 files from physical device hosting hubot
function say(man_dur, track) {
    if (sounds_on) {
        shell.exec(player + track_dir + track, { async: true, silent: true });
        eye_flash(man_dur, track_dir + track);
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

    robot.hear(/buildMonitoring (.*)/i, function (msg) {
        // var str = "1:joe 2:win 3:now";
        whole = msg.match[1]
        tuples = whole.split(' ')   
        // name
        KVpair1 = tuples[0]
        console.log(KVpair1)
        tuple = KVpair1.split('|')
        name = tuple[1]
        // status
        KVpair2 = tuples[1]
        console.log(KVpair2)
        tuple = KVpair2.split('|')
        status = tuple[1]
        if (status === 'Success')
            say(1.08, "impresiv.mp3")
        else
            say(2.2, "dontfail.mp3")
        // t-stamp
        KVpair3 = tuples[2]
        console.log(KVpair3)
        tuple = KVpair3.split('|')
        tstamp = tuple[1]

        room = findRoom(msg)
        monitorBuild(room, name, status, tstamp, msg)
        // chat_it(msg, "Monitoring build " + name);
        // say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader watch build (.*)/i, function (msg) {
        name = msg.match[1]
        room = findRoom(msg)
        monitorBuild(room, name, msg)
        // chat_it(msg, "Monitoring build " + name);
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader build status/igm, function (msg) {
        room = findRoom(msg)
        listBuildsForRoom(room, msg)
        // say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader list builds/igm, function (msg) {
        room = findRoom(msg)
        listBuildsForRoom(room, msg)
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader clear builds/igm, function (msg) {
        room = findRoom(msg)
        clearAllBuildsForRoom(room, msg)
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader eyes on/igm, function (msg) {
        eyes_on = true;
        chat_it(msg, "Here's looking at you");
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader eyes off/igm, function (msg) {
        eyes_on = false;
        chat_it(msg, "I'm resting my eyes");
        // 1.83
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader speech on/igm, function (msg) {
        sounds_on = true;
        chat_it(msg, "making noise");
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader speech off/igm, function (msg) {
        sounds_on = false;
        chat_it(msg, "silent running");
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader comms on/igm, function (msg) {
        comms_on = true;
        chat_it(msg, "engage chatter");
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader comms off/igm, function (msg) {
        comms_on = false;
        chat_it(msg, "cutting out the chatter");
        say(1.83, "as_wish.mp3");
    });

    robot.hear(/vader dont fail/igm, function (msg) {
        say(2.2, "dontfail.mp3");
    });

    robot.hear(/vader build pass/igm, function (msg) {
        // chat_it(msg, "Impressive");
        say(3.5, "proud.mp3");
    });

    robot.hear(/Git push detected/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(8.65, "pushit.mp3");
    });

    robot.hear(/vader breath/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(4.5, "breath.mp3");
    });
    robot.hear(/vader disintigrate/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(3.9, "dsntgrt.mp3");
    });
    robot.hear(/vader all to easy/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(1.1, "all2easy.mp3");
    });
    robot.hear(/vader waiting/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(2.5, "waiting.mp3");
    });
    robot.hear(/vader power/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(4.0, "power.mp3");
    });
    robot.hear(/vader no escape/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(5.0, "noescap.mp3");
    });
    robot.hear(/vader impressive/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(1.08, "impresiv.mp3");
    });
    robot.hear(/vader bidding/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(2.45, "bidding.mp3");
    });
    robot.hear(/vader honored/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(3.1, "honored.mp3");
    });
    robot.hear(/vader force/igm, function (msg) {
        //  chat_it(msg, "Real Good");
        say(8.9, "theforce.mp3");
    });
}