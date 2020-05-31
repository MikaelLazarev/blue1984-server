import fs from "fs";
import Ajv from "ajv";

export interface ConfigParams {
  port: number;
  bluzelle_mnemonic: string;
  bluzelle_endpoint: string;
  bluzelle_chain_id: string;
  mainDB: string;
  sentryDSN: string;
}

const configSchema = {
  type: "object",
  required: [
    "port",
    "bluzelle_mnemonic",
    "bluzelle_endpoint",
    "bluzelle_chain_id",
      "mainDB",
      "sentryDSN"
  ],
};

export function getConfig(): ConfigParams {
  const fileName = __dirname + "/config.json";

  let configData: ConfigParams;

  try {
    if (fs.existsSync(fileName)) {
      const configFileContent = fs.readFileSync(fileName);
      configData = JSON.parse(configFileContent.toString());
    } else {
      configData = {
        port: parseInt(process.env.PORT || "5000"),
        bluzelle_mnemonic: process.env.BLUZELLE_MNEMONIC || "",
        bluzelle_endpoint: process.env.BLUZELLE_ENDPOINT || "",
        bluzelle_chain_id: process.env.BLUZELLE_CHAIN_ID || "",
        mainDB: process.env.MAIN_DB || "Bluzelle1984",
        sentryDSN: process.env.SENTRY_DSN || "",
      };
    }

    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    const validate = ajv.compile(configSchema);

    const valid = validate(configData);
    if (!valid) {
      console.log(validate.errors);
      process.abort();
    }
  } catch (e) {
    console.log("Cant process configuration data", e);
    process.exit(1);
  }

  return configData;
}
const config = getConfig();

export default config;
