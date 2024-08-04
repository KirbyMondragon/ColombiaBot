import { addKeyword, EVENTS } from '@builderbot/bot';
import { MongoClient } from 'mongodb';
import registeredUsersFlow from "./registeredUsersFlow";

// Configuración de MongoDB
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5";
const client = new MongoClient(uri);

const registerUserInDB = async (name, phoneNumber) => {
  try {
    await client.connect();
    const database = client.db("BuffetColombia");
    const collection = database.collection("Clientes-abogados");
    const result = await collection.insertOne({ name, phoneNumber });
    return result.insertedId !== null;
  } finally {
    await client.close();
  }
};

// Define el flujo para usuarios no registrados
const unregisteredUsersFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "To register, I need your full name. Please enter your full name.",
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow }) => {

    const name = ctx.body;
    const phoneNumber = ctx.from;

    console.warn("aqui me quede")
    
    // Registrar el usuario en la base de datos
    try {
      const isRegistered = await registerUserInDB(name, phoneNumber);
      console.log("La neta ya registre")
      if (isRegistered) {
        await state.update({ Registration: true, Name: name });
        await flowDynamic("You have been successfully registered.");
      } else {
        await flowDynamic("There was an error registering you. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      await flowDynamic("There was an error registering you. Please try again.");
    }
  }
);

export default unregisteredUsersFlow;
