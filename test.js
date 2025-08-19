const Rcon = require('modern-rcon');

const rcon = new Rcon('26.24.33.153', 27015, 'floppy');
const connection = rcon.connect()
rcon.send('ent_create item_battery origin 0 0 0"')