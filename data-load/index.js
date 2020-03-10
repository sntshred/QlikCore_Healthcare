const webSocket = require("ws");
const enigma = require("enigma.js");
const schema = require("enigma.js/schemas/12.170.2.json");
const Haylard = require("halyard.js");
const mixins = require("halyard.js/dist/halyard-enigma-mixin");
const fs = require("fs");

const dataLoad = async () => {
  try {
    // DrugReport.csv

    const drugData = fs.readFileSync("./data/DrugReport.csv").toString();
    console.log(drugData);
    const halyard = new Haylard();

    const druginfo = new Haylard.Table(drugData);

    halyard.addTable(druginfo);

    const session = enigma.create({
      schema,
      mixins,
      url: "ws://localhost:19076",
      createSocket: url => new webSocket(url)
    });

    const qix = await session.open();
    await qix.createAppUsingHalyard("Drug_Qlik", halyard);
    await session.close();
    console.log("Session is closed");
  } catch (e) {
    console.log(e);
  }
};

dataLoad();

//docker run -p 19076:9076 qlikcore/engine:12.556.0 -S AcceptEULA=yes
