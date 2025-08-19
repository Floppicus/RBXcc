const express = require("express");
const fs = require('fs');
const app = express();
const port = 3000;
app.use((req, res, next) => {
    //const apiKey = req.query.api_key;
    //if (apiKey != API_Key) {
    //    return res.status(401).json({error: "Stinky key!"})
    //}
    next();
})
let chars = {}

let players = {}

let message = {}
let messageID = 0

let npcs = {}
let objs = {}
let funcs = {}
let ents = {}
let ropes = {}

let cnttt = 0

app.get("/rbxcc", (req, res) => {
    let cnt = 0
    let plrsstr = ''
    for (let i in players) {
        cnt = cnt + 1
        if (cnt != 1) {
            plrsstr = plrsstr + ',' + i
        } else {
            plrsstr = plrsstr + i
        }
    }
    cnt = 0
    let chrsstr = ''
    for (let i in chars) {
        cnt = cnt + 1
        if (cnt != 1) {
            chrsstr = chrsstr + ',' + i
        } else {
            chrsstr = chrsstr + i
        }
    }
    const data = {
        message: "Success",
        WORLD: {
            NPCS: npcs,
            PROPS: objs,
            ENTS: ents,
            FUNCS: funcs,
            ROPES: ropes
        },
        CHAR: chrsstr,
        CHARS: chars,
        PLR: plrsstr,
        PLRS: players,
        MSGS: message,
        MSG: messageID
    }
    cnttt = cnttt + 1
    if (cnttt >= 80) {
        cnttt = 0
        //console.log();
    }
    res.json(data);
})

app.get("/", (req, res) => {
    const data = {
        message: "WELCOME"
    }
    res.json(data);
})

app.get("/files/:file", (req, res) => {
    if (fs.existsSync('/rbx/files/' + req.params.file)) {
        res.sendFile('/rbx/files/' + req.params.file)
    } else {
        return res.status(404).json({error: "File not found!"})
    }
    
})
app.get("/favicon.png", (req, res) => {
    res.sendFile('/rbx/files/favicon.png');
})

app.get("/rbxcc/data", (req, res) => {
    if (req.query.TYPE == 1) { //roblox
        const NAME = req.query.NAME;
        if (NAME == null) {
            return res.status(400).json({error: "No nickname!"})
        }
        const HP = req.query.HP;
        const X = req.query.X || 0;
        const Y = req.query.Y || 0;
        const Z = req.query.Z || 0;
        const Xang = req.query.x || 0;
        const Yang = req.query.y || 0;
        const Zang = req.query.z || 0;
        const State = req.query.STATE || 1
        if (chars[NAME] == null) {
            chars[NAME] = {
                HP: 100,
                PHYSICS: {
                    BURN: 0
                }
            }
        }
        if (HP != null) {
            chars[NAME]['HP'] = HP
        }

        chars[NAME]['POS'] = {
                X: X,
                Y: Y,
                Z: Z
            }
        chars[NAME]['ANG'] = {
                X: Xang,
                Y: Yang,
                Z: Zang
            }
        chars[NAME]['STATE'] = State
            
        return res.json({ message: "Success" });
    }
    if (req.query.TYPE == 2) { //gmod
        const NAME = req.query.NAME;
        if (NAME == null) {
            return res.status(400).json({error: "No nickname!"})
        }
        const X = req.query.X || 0;
        const Y = req.query.Y || 0;
        const Z = req.query.Z || 0;
        const Sit = req.query.SIT || false;
        const Act = req.query.ANIM || 0;
        const FF = req.query.FF || 0;
        const Xang = req.query.x || 0;
        const TOOL = req.query.TOOL || null;
        const Yang = req.query.y || 0;
        const Zang = req.query.z || 0;
        const COLORS = {R: req.query.COL1,G: req.query.COL2,B: req.query.COL3} || {R: 255, G: 255,B: 255};
        const HP = req.query.HP || 100;
        players[NAME] = {
            Anim: Act,
            Sit: Sit,
            X: X,
            Y: Y,
            Z: Z,
            FF: FF,
            Xang: Xang,
            Yang: Yang,
            Zang: Zang,
            Health: HP,
            Tool: TOOL,
            Color: COLORS
        }
        
        return res.json({ message: "Success" });
    }
    if (req.query.TYPE == 3) { //hurt
        const NAME = req.query.NAME;
        if (NAME == null) {
            return res.status(400).json({error: "No nickname!"})
        }
        if (chars[NAME] == null) {
            return res.status(400).json({error: "Invalid player!"})
        }
        const DMG = req.query.DMG;
        if (chars[NAME]['HP'] != 101) {
            chars[NAME]['HP'] = chars[NAME]['HP'] - DMG
        }
        if (chars[NAME]['HP'] > 101) {
            chars[NAME]['HP'] = 100
        }

        return res.json({ message: "Success", hp: chars[NAME]['HP'] });
    }
    if (req.query.TYPE == 4) { //chat
        const NAME = req.query.NAME;
        const SIDE = req.query.SIDE;
        const MSG = req.query.MSG;
        if (SIDE == null) {
            return res.status(400).json({error: "No side!"})
        }
        if (NAME == null) {
            return res.status(400).json({error: "No nickname!"})
        }
        if (MSG == null) {
            return res.status(400).json({error: "No message!"})
        }
        if (SIDE == 1) {
            const COLOR = req.query.COLOR;
            if (COLOR == null) {
                return res.status(400).json({error: "No color!"})
            }
            messageID = messageID + 1
            message[messageID] = COLOR + "[]|/()" + NAME + "[]|/()" + MSG
        }
        if (SIDE == 2) {
            messageID = messageID + 1
            message[messageID] = '<font color="#FFFF64">' + NAME + '</font>: ' + MSG
        }
        return res.json({ message: "Success" });
    }
    if (req.query.TYPE == 5) { //remove plr
        const NAME = req.query.NAME;
        const SIDE = req.query.SIDE;
        if (NAME == null) {
            return res.status(400).json({error: "No nickname!"})
        }
        if (SIDE == null) {
            return res.status(400).json({error: "No side!"})
        }
        if (SIDE == 2) {
            players[NAME] = null
        } else {
            chars[NAME] = null
        }
        
        return res.json({ message: "Success" });
    }
    if (req.query.TYPE == 6) { //roblox physics
        const NAME = req.query.NAME;
        if (NAME == null) {
            return res.status(400).json({error: "No nickname!"})
        }
        const Tab = req.query.TAB;
        if (Tab == null) {
            return res.status(400).json({error: "No tab!"})
        }
        const Val = req.query.VALUE;
        if (Val == null) {
            return res.status(400).json({error: "No value!"})
        }
        if (chars[NAME] != null) {
            if (chars[NAME]['PHYSICS'] != null ) {
                chars[NAME]['PHYSICS'][Tab] = Val;
            } else {
                return res.status(409).json({error: "Does not exist!"})
            }
        } else {
            return res.status(409).json({error: "Does not exist!"})
        }
        return res.json({ message: "Success" });
    }
    if (req.query.TYPE == 7) { //gmod spawns
        const OBJ = req.query.OBJ;
        if (OBJ == null) {
            return res.status(400).json({error: "No object!"})
        }
        const OBJS = req.query.OBJS;
        if (OBJS == null) {
            return res.status(400).json({error: "No objects!"})
        }
        if (OBJ == 1) {
            const GO = req.query.GO;
            if (GO == null) {
                return res.status(400).json({error: "No go!"})
            }
            const objz = JSON.parse(OBJS);
            if (GO == 1) { //rewrite
                for (let i in objz) {
                    objs[i] = objz[i]
                }
                return res.json({ message: "Success" });
            }
            if (GO == 2) { //remove
                for (let i in objz) {
                    objs[objz[i]] = null
                }
                return res.json({ message: "Success" });
            }
            if (GO == 3) { //clear
                objs = {}
                return res.json({ message: "Success" });
            }
            return res.status(409).json({error: "Unknown go!"})
        }
        if (OBJ == 2) {
            ents = JSON.parse(OBJS);
            return res.json({ message: "Success" });
        }
        if (OBJ == 3) {
            funcs = JSON.parse(OBJS);
            return res.json({ message: "Success" });
        }
        
        return res.status(409).json({error: "Unknown obj!"})
    }
    if (req.query.TYPE == 8) { //roblox interact gmod ent
        const NAME = req.query.NAME;
        const OBJ = req.query.OBJ;
        const INT = req.query.INT;
        if (OBJ == null) {
            return res.status(400).json({error: "No object!"})
        }
        if (INT == null) {
            return res.status(400).json({error: "Invalid interaction!"})
        }

        if (INT == 1) {
            objs[OBJ]['PUSH'] = 1;
        }
        if (INT == 2) {
            if (NAME == null) {
                return res.status(400).json({error: "No nickname!"})
            }
            objs[OBJ]['USE'] = NAME;
        }
        
        return res.json({ message: "Success" });
    }
    return res.status(400).json({error: "No type!"})
})

app.listen(port, () => {
    console.log("server is on");
})