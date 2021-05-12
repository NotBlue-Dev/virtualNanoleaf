
var sqlite3 = require('sqlite3');
const fs = require('fs'); 
const DBSOURCE = "db.sqlite"
input = JSON.parse(fs.readFileSync(path.join(__dirname, '../customPanel.json'), 'utf8'));
data = [input[0],input[1], JSON.stringify(input[2])];

//some default effect
let effec = [["Nemo","false",'{"animName":"Nemo","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":23,"saturation":100,"brightness":100,"probability":0},{"hue":108,"saturation":5,"brightness":100,"probability":0}],"pluginOptions":[{"name":"delayTime","value":12},{"name":"loop","value":true},{"name":"mainColorProb","value":80},{"name":"transTime","value":20}],"pluginType":"color","pluginUuid":"70b7c636-6bf8-491f-89c1-f4103508d642","version":"2.0"}'],
["Flames","false",'{"animName":"Flames","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":32,"saturation":100,"brightness":46,"probability":0},{"hue":39,"saturation":100,"brightness":37,"probability":0},{"hue":39,"saturation":100,"brightness":73,"probability":0}],"pluginOptions":[{"name":"delayTime","value":0},{"name":"loop","value":true},{"name":"mainColorProb","value":80},{"name":"transTime","value":7}],"pluginType":"color","pluginUuid":"70b7c636-6bf8-491f-89c1-f4103508d642","version":"2.0"}'],
["Night Light","false",'{"animName":"Night Light","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":15,"saturation":7,"brightness":0,"probability":0},{"hue":0,"saturation":0,"brightness":21,"probability":0},{"hue":0,"saturation":0,"brightness":28,"probability":0},{"hue":0,"saturation":0,"brightness":10,"probability":0},{"hue":34,"saturation":100,"brightness":100,"probability":0},{"hue":38,"saturation":100,"brightness":94,"probability":0},{"hue":0,"saturation":0,"brightness":25,"probability":0},{"hue":0,"saturation":0,"brightness":14,"probability":0},{"hue":0,"saturation":0,"brightness":7,"probability":0},{"hue":0,"saturation":0,"brightness":11,"probability":0},{"hue":0,"saturation":0,"brightness":5,"probability":0},{"hue":0,"saturation":0,"brightness":5,"probability":0},{"hue":0,"saturation":0,"brightness":15,"probability":0}],"pluginOptions":[{"name":"delayTime","value":182},{"name":"mainColorProb","value":35.95837818622589},{"name":"transTime","value":11}],"pluginType":"color","pluginUuid":"70b7c636-6bf8-491f-89c1-f4103508d642","version":"2.0"}'],
["Playstation Blue","false",'{"animName":"Playstation Blue","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":214,"saturation":100,"brightness":61,"probability":0},{"hue":207,"saturation":100,"brightness":80,"probability":0}],"pluginOptions":[{"name":"delayTime","value":11},{"name":"mainColorProb","value":60.97000143051148},{"name":"transTime","value":7}],"pluginType":"color","pluginUuid":"70b7c636-6bf8-491f-89c1-f4103508d642","version":"2.0"}'],
["Romantic","false",'{"animName":"Romantic","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":344,"saturation":67,"brightness":100,"probability":0},{"hue":307,"saturation":100,"brightness":100,"probability":0},{"hue":259,"saturation":56,"brightness":100,"probability":0},{"hue":356,"saturation":98,"brightness":100,"probability":0},{"hue":309,"saturation":50,"brightness":100,"probability":0}],"pluginOptions":[{"name":"delayTime","value":0},{"name":"mainColorProb","value":80},{"name":"transTime","value":45},{"name":"loop","value":true}],"pluginType":"color","pluginUuid":"70b7c636-6bf8-491f-89c1-f4103508d642","version":"2.0"}'],
["Random","false",'{"animName":"Random","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":52,"saturation":99,"brightness":85,"probability":0},{"hue":6,"saturation":87,"brightness":64,"probability":0},{"hue":18,"saturation":50,"brightness":87,"probability":0},{"hue":52,"saturation":97,"brightness":100,"probability":0},{"hue":182,"saturation":43,"brightness":50,"probability":0},{"hue":129,"saturation":98,"brightness":50,"probability":0},{"hue":170,"saturation":37,"brightness":76,"probability":0},{"hue":359,"saturation":50,"brightness":68,"probability":0}],"pluginOptions":[{"name":"delayTime","value":0},{"name":"transTime","value":168}],"pluginType":"color","pluginUuid":"ba632d3e-9c2b-4413-a965-510c839b3f71","version":"2.0"}'],
["Green Blue Random", "false", '{"animName":"Green Blue Random","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":120,"saturation":100,"brightness":100,"probability":0},{"hue":150,"saturation":100,"brightness":100,"probability":0},{"hue":164,"saturation":100,"brightness":100,"probability":0},{"hue":180,"saturation":100,"brightness":100,"probability":0},{"hue":190,"saturation":100,"brightness":100,"probability":0},{"hue":209,"saturation":100,"brightness":100,"probability":0},{"hue":224,"saturation":100,"brightness":100,"probability":0},{"hue":240,"saturation":100,"brightness":100,"probability":0}],"pluginOptions":[{"name":"delayTime","value":0},{"name":"transTime","value":30}],"pluginType":"color","pluginUuid":"ba632d3e-9c2b-4413-a965-510c839b3f71","version":"2.0"}'],
["RedAndWhite Random", "false", '{"animName":"RedAndWhite Random","animType":"plugin","colorType":"HSB","hasOverlay":false,"palette":[{"hue":0,"saturation":100,"brightness":100,"probability":0},{"hue":0,"saturation":0,"brightness":0,"probability":0},{"hue":0,"saturation":100,"brightness":100,"probability":0},{"hue":0,"saturation":0,"brightness":0,"probability":0},{"hue":0,"saturation":0,"brightness":100,"probability":0},{"hue":0,"saturation":0,"brightness":0,"probability":0},{"hue":0,"saturation":100,"brightness":100,"probability":0},{"hue":0,"saturation":0,"brightness":0,"probability":0},{"hue":0,"saturation":0,"brightness":100,"probability":0},{"hue":0,"saturation":0,"brightness":0,"probability":0},{"hue":0,"saturation":100,"brightness":100,"probability":0},{"hue":0,"saturation":0,"brightness":0,"probability":0},{"hue":0,"saturation":100,"brightness":100,"probability":0},{"hue":0,"saturation":0,"brightness":0,"probability":0}],"pluginOptions":[{"name":"delayTime","value":5},{"name":"transTime","value":15}],"pluginType":"color","pluginUuid":"ba632d3e-9c2b-4413-a965-510c839b3f71","version":"2.0"}']]

let plug = [["Flow",'{"author":"Nanoleaf","description":"Just like random, but you will mostly see the first color of your palette. The other colors fade in periodically.","features":["touch"],"name":"Flow","pluginConfig":[{"name":"transTime","type":"int","defaultValue":24,"minValue":1,"maxValue":600},{"name":"delayTime","type":"int","defaultValue":0,"minValue":0,"maxValue":600},{"name":"linDirection","type":"string","defaultValue":"right","strings":["left","right","up","down"]}],"tags":["happy"," zen"],"type":"color","uuid":"027842e4-e1d6-4a4c-a731-be74a1ebd4cf"}'],
["Wheel",'{"author":"Nanoleaf","description":"Provides a continuous moving gradient of color created from your palette.","features":["touch"],"name":"Wheel","pluginConfig":[{"name":"loop","type":"bool","defaultValue":true},{"name":"transTime","type":"int","defaultValue":24,"minValue":1,"maxValue":600},{"name":"nColorsPerFrame","type":"int","defaultValue":2,"minValue":2,"maxValue":50},{"name":"linDirection","type":"string","defaultValue":"right"}],"tags":["party"," chill"," zen"],"type":"color","uuid":"6970681a-20b5-4c5e-8813-bdaebc4ee4fa"}'],
["Burst",'{"author":"Nanoleaf","description":"Your palette colors radiate out from the center of the panels.","features":["touch"],"name":"Burst","pluginConfig":[{"name":"loop","type":"bool","defaultValue":true},{"name":"transTime","type":"int","defaultValue":24,"minValue":1,"maxValue":600},{"name":"delayTime","type":"int","defaultValue":0,"minValue":0,"maxValue":600}],"tags":["chill"," zen"],"type":"color","uuid":"713518c1-d560-47db-8991-de780af71d1e"}'],
["Fade",'{"author":"Nanoleaf","description":"The Light Panels cycle through your palette colors all together.","features":["touch"],"name":"Fade","pluginConfig":[{"name":"loop","type":"bool","defaultValue":true},{"name":"transTime","type":"int","defaultValue":24,"minValue":1,"maxValue":600},{"name":"delayTime","type":"int","defaultValue":0,"minValue":0,"maxValue":600}],"tags":["chill"," zen"],"type":"color","uuid":"b3fd723a-aae8-4c99-bf2b-087159e0ef53"}'],
["Random",'{"author":"Nanoleaf","description":"This will take your palette colors and randomly animate them across your panels.","features":["touch"],"name":"Random","pluginConfig":[{"name":"transTime","type":"int","defaultValue":24,"minValue":1,"maxValue":600},{"name":"delayTime","type":"int","defaultValue":0,"minValue":0,"maxValue":600}],"tags":["party"," happy"],"type":"color","uuid":"ba632d3e-9c2b-4413-a965-510c839b3f71"}'],
["Highlight",'{"author":"Nanoleaf","description":"Just like random, but you will mostly see the first color of your palette. The other colors fade in periodically.","features":["touch"],"name":"Highlight","pluginConfig":[{"name":"transTime","type":"int","defaultValue":24,"minValue":1,"maxValue":600},{"name":"delayTime","type":"int","defaultValue":0,"minValue":0,"maxValue":600},{"name":"mainColorProb","type":"double","defaultValue":80,"minValue":0,"maxValue":100}],"tags":["chill"," zen"],"type":"color","uuid":"70b7c636-6bf8-491f-89c1-f4103508d642"}']]


let db = new sqlite3.Database(DBSOURCE)
    
db.serialize(function() {
    console.log('Connected to the SQLite database.')

    //create tables

    //users (token)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        token VARCHAR  NOT NULL,
        CONSTRAINT unique_token UNIQUE (token)
    )`)
    
    db.get(`select count(*) from users`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO users VALUES (?)'
        db.run(stmt, 'VirtualDevToken', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
          setToken();
        });
      }
    });

    //name
    db.run(`CREATE TABLE IF NOT EXISTS name (
      name VARCHAR  NOT NULL
    )`)
    
    //serialnumber
    db.run(`CREATE TABLE IF NOT EXISTS serialNo (
      serialNo VARCHAR  NOT NULL
    )`)

    db.run(`CREATE TABLE IF NOT EXISTS type (
      type VARCHAR
    )`)
    
    //manufacturer
    db.run(`CREATE TABLE IF NOT EXISTS manufacturer (
      manufacturer VARCHAR  NOT NULL
    )`)

    //manufacturer
    db.run(`CREATE TABLE IF NOT EXISTS firmwareVersion (
      firmwareVersion VARCHAR NOT NULL
    )`)

    //hardwareVersion
    db.run(`CREATE TABLE IF NOT EXISTS hardwareVersion (
      hardwareVersion VARCHAR NOT NULL
    )`)

    //model
    db.run(`CREATE TABLE IF NOT EXISTS model (
      model VARCHAR NOT NULL
    )`)

    //Cloudhash
    db.run(`CREATE TABLE IF NOT EXISTS cloudHash (
      cloudHash VARCHAR NOT NULL
    )`)

    //model
    db.run(`CREATE TABLE IF NOT EXISTS discovery (
      discovery VARCHAR NOT NULL
    )`)
    
    //plugins
    db.run(`CREATE TABLE IF NOT EXISTS plugins (
      pluginsName VARCHAR NOT NULL,
      pluginsData VARCHAR NOT NULL,
      CONSTRAINT unique_plugins UNIQUE (pluginsName)
    )`)

    //effect
    db.run(`CREATE TABLE IF NOT EXISTS effects (
      effectsList VARCHAR NOT NULL,
      selects VARCHAR ,
      effectsData VARCHAR,
      CONSTRAINT unique_effect UNIQUE (effectsList)

    )`) //selects in this tables is useless need to be removed
    
    //Select
    db.run(`CREATE TABLE IF NOT EXISTS selects (
      selects VARCHAR
    )`)

    //firmewareUpgrade
    db.run(`CREATE TABLE IF NOT EXISTS firmwareUpgrade (
      firmwareUpgrade VARCHAR NOT NULL
    )`)
    
    //panelLayout
    db.run(`CREATE TABLE IF NOT EXISTS panelLayout (
      globalOrientation VARCHAR NOT NULL
    )`)
    
    //layout
    db.run(`CREATE TABLE IF NOT EXISTS layout (
      numPanels INT NOT NULL,
      sideLength INT NOT NULL,
      positionData VARCHAR NOT NULL
    )`)

    //schedules
    db.run(`CREATE TABLE IF NOT EXISTS schedules (
      schedules VARCHAR NOT NULL
    )`)
    
    //state
    db.run(`CREATE TABLE IF NOT EXISTS state (
      brightness VARCHAR NOT NULL
    )`)
    
    //effect
    db.run(`CREATE TABLE IF NOT EXISTS colorMode (
      colorMode VARCHAR NOT NULL
    )`)
    
    //ct
    db.run(`CREATE TABLE IF NOT EXISTS ct (
      ct VARCHAR NOT NULL
    )`)

    //hue
    db.run(`CREATE TABLE IF NOT EXISTS hue (
      hue VARCHAR NOT NULL
    )`)
    
    //on
    db.run(`CREATE TABLE IF NOT EXISTS one (
      value VARCHAR NOT NULL
    )`)
    
    //sat
    db.run(`CREATE TABLE IF NOT EXISTS sat (
      sat VARCHAR NOT NULL
    )`)

    //INSERT
    db.get(`select count(*) from hardwareVersion`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO hardwareVersion VALUES (?)'
        db.run(stmt, '2.0-4', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });
    db.get(`select count(*) from firmwareVersion`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO firmwareVersion VALUES (?)'
        db.run(stmt, '5.0.1', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from name`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO name VALUES (?)'
        db.run(stmt, 'VirtualCanvas F7EZ', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from type`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO type VALUES (?)'
        db.run(stmt, '', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });
  
    db.get(`select count(*) from serialNo`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO serialNo VALUES (?)'
        db.run(stmt, 'S19024C1023', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });
    
    db.get(`select count(*) from manufacturer`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO manufacturer VALUES (?)'
        db.run(stmt, 'Nanoleaf', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from model`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO model VALUES (?)'
        db.run(stmt, 'NL29', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from cloudHash`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO cloudHash VALUES (?)'
        db.run(stmt, '{}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from discovery`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO discovery VALUES (?)'
        db.run(stmt, '{}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from effects`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO effects VALUES (?,?,?)'
        effec.forEach(item => {
          db.run(stmt, [item[0], item[1], item[2]], function (err, result) {
            if (err) {
              return console.error(err.message);
            }
          });
        });

      }
    });

    
    db.get(`select count(*) from plugins`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO plugins VALUES (?,?)'
        plug.forEach(item => {
          db.run(stmt, [item[0], item[1]], function (err, result) {
            if (err) {
              return console.error(err.message);
            }
          });
        });

      }
    });

    db.get(`select count(*) from selects`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO selects VALUES (?)'
        db.run(stmt, ['Nemo'], function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });


    db.get(`select count(*) from firmwareUpgrade`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO firmwareUpgrade VALUES (?)'
        db.run(stmt, '{}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from panelLayout`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO panelLayout VALUES (?)'
        db.run(stmt, '{"value": 0,"max": 360,"min": 0}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.run(`DELETE FROM layout`, function (err, result) {
      if (err) {
        return console.error(err.message);
      }
    });
    db.get(`select count(*) from layout`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO layout VALUES (?,?,?)'
        db.run(stmt, data, function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from state`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO state VALUES (?)'
        db.run(stmt, '{"value": 100,"max": 100,"min": 0}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from schedules`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO schedules VALUES (?)'
        db.run(stmt, '{}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from colorMode`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO colorMode VALUES (?)'
        db.run(stmt, 'hs', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from ct`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO ct VALUES (?)'
        db.run(stmt, '{"value": 2700,"max": 6500,"min": 1200}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

    db.get(`select count(*) from hue`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO hue VALUES (?)'
        db.run(stmt, '{"value": 0,"max": 360,"min": 0}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });
    
    db.get(`select count(*) from one`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO one VALUES (?)'
        db.run(stmt, 'true', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });
    
    db.get(`select count(*) from sat`, function (err, result) {
      if (Object.values(result) >=1 == false) {
        stmt = 'INSERT INTO sat VALUES (?)'
        db.run(stmt, '{"value": 100,"max": 100,"min": 0}', function (err, result) {
          if (err) {
            return console.error(err.message);
          }
        });
      }
    });

});

module.exports = db
