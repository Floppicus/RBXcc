const express = require("express");
const app = express();
const port = 3000;
const Rcon = require('modern-rcon');
const rcon = new Rcon('26.24.33.153', 27015, 'floppy');
const connection = rcon.connect()
app.use((req, res, next) => {
    //const apiKey = req.query.api_key;
    //if (apiKey != API_Key) {
    //    return res.status(401).json({error: "Stinky key!"})
    //}
    const gm = 1
    const X = req.query.X || 0;
    const Y = req.query.Y || 0;
    const Z = req.query.Z || 0;

    const Xang = req.query.x || 0;
    const Yang = req.query.y || 0;
    const Zang = req.query.z || 0;
    if (gm == 0) {
        rcon.send('ent_fire PLAYER addoutput "origin ' + X + ' ' + Y + ' ' + Z + '"').then(() => {
            rcon.send('ent_fire PLAYER addoutput "angles ' + Xang + ' ' + Yang + ' ' + Zang + '"').then(() => {
                console.log(req.query.X + ' ' + req.query.Y + ' ' + req.query.Z + ' Success');
            }).catch((rej) => {
                console.warn(rej);
                rcon.disconnect().then(() => {
                    rcon.connect();
                });
            });
        });
    } else {
        if (gm == 1) {
            rcon.send('rbx_setpos ' + X + ' ' + Y + ' ' + Z).then(() => {
                rcon.send('rbx_setang ' + Xang + ' ' + Yang + ' ' + Zang).then(() => {
                    console.log(req.query.X + ' ' + req.query.Y + ' ' + req.query.Z + ' Success');
                }).catch((rej) => {
                    console.warn(rej);
                    rcon.disconnect().then(() => {
                        rcon.connect();
                    });
                });
            });
        }
    };
    next();
})

app.get("/hl2/robloxstudio", (req, res) => {
    
    const data = {
        message: "Success", //any values
        //Size: {X: 10, Y:10, Z:10}
    }
    res.json(data);
})

app.listen(port, () => {
    console.log("server is on");
})