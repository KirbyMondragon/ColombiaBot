import { createBot, createProvider, createFlow, addKeyword, MemoryDB, EVENTS } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { MongoClient } from "mongodb";
import registeredUsersFlow from "./flows/registeredUsersFlow";
import unregisteredUsersFlow from "./flows/unregisteredUsersFlow";

// Configuración de MongoDB
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5";
const client = new MongoClient(uri);

const checkUserInDB = async (phoneNumber) => {
  try {
    await client.connect();
    const database = client.db("BuffetColombia");
    const collection = database.collection("Clientes-abogados");
    const user = await collection.findOne({ phoneNumber: phoneNumber });
    return user !== null;
  } finally {
    await client.close();
  }
};

const welcomeFlow = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { gotoFlow, state }) => {
    try {
      const isRegistered = await checkUserInDB(ctx.from);

      if (!isRegistered) {
        await state.update({ Registration: false });
        console.log("No estas registrado")
        return gotoFlow(unregisteredUsersFlow);
      }
      return gotoFlow(registeredUsersFlow);
    } catch (error) {
      console.error("Error checking registration status:", error);
      await state.update({ Registration: false });
      return gotoFlow(unregisteredUsersFlow);
    }
  }
);

export default welcomeFlow;