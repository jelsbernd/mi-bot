module.exports = (robot) ->
  robot.hear /^sounds\?$/i, (msg) ->
    msg.send "/mpg123 56k\n
/mpg123 bell\n
/mpg123 bezos\n
/mpg123 bueller\n
/mpg123 clowntown\n
/mpg123 crickets\n
/mpg123 dangerzone\n
/mpg123 deeper\n
/mpg123 drama\n
/mpg123 greatjob\n
/mpg123 heygirl\n
/mpg123 horn\n
/mpg123 horror\n
/mpg123 inconceivable\n
/mpg123 live\n
/mpg123 loggins\n
/mpg123 makeitso\n
/mpg123 noooo\n
/mpg123 nyan\n
/mpg123 ohmy\n
/mpg123 ohyeah\n
/mpg123 pushit\n
/mpg123 rimshot\n
/mpg123 sax\n
/mpg123 secret\n
/mpg123 sexyback\n
/mpg123 tada\n
/mpg123 tmyk\n
/mpg123 trololo\n
/mpg123 trombone\n
/mpg123 vuvuzela\n
/mpg123 what\n
/mpg123 whoomp\n
/mpg123 yeah\n
/mpg123 yodel"