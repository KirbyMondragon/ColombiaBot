import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MongoAdapter as Database } from '@builderbot/database-mongo'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import welcomeFlow from './Welcome.flow'
import SendMail from './backend/ApisRest'

const PORT = 3008
// Definir submenús


  



const RecepcionConsultas = addKeyword(["1"]).addAnswer(
    [
        "**Recepción de Consultas Generales**",
        "",
        "Elige una opción :",
        "1️⃣ Resolución de dudas sobre su caso.",
        "2️⃣ Proporcionar información sobre los servicios de la firma.",
        "3️⃣ Contactar con uno de nuestros asesores."
    ].join('\n'),
    { capture: true },
    async (ctx, { fallBack, state , flowDynamic}) => {

        const validOptions = ["1","2","3"];

        if (validOptions.includes(ctx.body)){
            await state.update({ opcion: "Recepción de Consultas Generales" })
            const Name = state.get('name');
            const Number = ctx.from;
            const NumeroA = state.get('NumeroA');
            const Opcion = state.get('opcion');
            await SendMail(Name , Number,NumeroA, Opcion);
            await flowDynamic(`Estimado/a ${Name} , Gracias por contactarnos. En breve, uno de nuestros asesores se pondrá en contacto con usted para asistirle con su solicitud. Saludos cordiales. Abogado guerrero PLLC`);
            console.log(Name ,Number,NumeroA, Opcion)
        }
       
        if (!validOptions.includes(ctx.body)) {
            return fallBack("Por favor, selecciona una opción válida del menú de Recepción de Consultas.");
        }
    },[]
);


const FechasCorte = addKeyword(["2"]).addAnswer(
    [
        "**Fechas de Corte (Fechas de Audiencia)**",
        "",
        "Elige una opción:",
        "1️⃣ Obtener información sobre su próxima audiencia.",
        "2️⃣ Verificar fechas de corte programadas.",
        "3️⃣ Validar medio de fecha de corte."
    ].join('\n'),
    { capture: true },
    async (ctx, { fallBack,state }) => {
        const validOptions = ["1","2","3"];

        if (validOptions.includes(ctx.body)){
            await state.update({ opcion: "Fechas de Corte (Fechas de Audiencia)" })
        }
        if (!validOptions.includes(ctx.body)) {
            return fallBack("Por favor, selecciona una opción válida del menú de Fechas de Corte.");
        }
    },[]
);


const PermisoTrabajo = addKeyword(["3"]).addAnswer(
    [
        "**Consultas y Formulación de su Permiso de Trabajo**",
        "",
        "Elige una opción:",
        "1️⃣ Obtener información sobre cómo solicitar un permiso de trabajo.",
        "2️⃣ Verificar el estado de su solicitud de permiso de trabajo.",
        "3️⃣ Solicitar Recibo de comprobación de Envío de Permiso de Trabajo.",
        "4️⃣ Permiso Negado, contactar con uno de nuestros asesores."
    ].join('\n'),
    { delay: 800, capture: true },
    async (ctx, { fallBack ,state}) => {

        const validOptions = ["1","2","3","4"];

        if (validOptions.includes(ctx.body)){
            await state.update({ opcion: "Consultas y Formulación de su Permiso de Trabajo" })
        }
        if (!validOptions.includes(ctx.body)) {
            return fallBack("Por favor, selecciona una opción válida del menú de Permiso de Trabajo.");
        }
    },[]
);


const HuellasBiometricas = addKeyword(["4"]).addAnswer(
    [
        "**Huellas Biométricas, Cita, Programación y Reprogramación**",
        "",
        "Podrás seleccionar uno de los siguientes servicios escribiendo el número correspondiente:",
        "",
        "1️⃣ Programar una cita para huellas biométricas.",
        "2️⃣ Reprogramar una cita existente.",
        "3️⃣ Obtener detalles sobre el proceso de Huellas Biométricas.",
        "4️⃣ Consultar estado de Huellas Biometricas.",
        "Para seleccionar una opción, simplemente responde con el número correspondiente."

    ].join('\n'),
    { capture: true },
    async (ctx, { fallBack,state}) => {
        const validOptions = ["1", "2", "3", "4"];

        if (validOptions.includes(ctx.body)){
            await state.update({ opcion: "Huellas Biométricas, Cita, Programación y Reprogramación" })
        }
        if (!validOptions.includes(ctx.body)) {
            return fallBack("Por favor, selecciona una opción válida del menú de Huellas Biométricas.");
        }
    },[]
);





    const formularioFinal = addKeyword(EVENTS.WELCOME)
    .addAnswer([ 
        `**¡Bienvenido! 🌟 Soy el BOT de Abogado Guerrero PLLC.**`,
        "Antes de proceder, por favor, compárteme la siguiente información para notificar a nuestros Asesores:",
        "1. Nombre Completo:",
    ], { capture: true }, async (ctx, { state }) => {
        await state.update({ name: ctx.body })
        
    })
    .addAnswer(`Gracias, Ahora , si lo deseas, proporciona tu Numero A# (Opcional, al digitar no incluir '-'): `, { capture: true }, async (ctx, { state }) => {
        const NumeroA = ctx.body
        await state.update({ NumeroA: NumeroA })
        //await flowDynamic(`Estimado/a ${ctx.name} , Gracias por contactarnos. En breve, uno de nuestros asesores se pondrá en contacto con usted para asistirle con su solicitud. Saludos cordiales. Abogado guerrero PLLC`);
    
      })
      .addAnswer('Gracias por la informacion. Con estos datos podre asistirte mejor. Selecciona el servicio que necesitas consultado el menu que proporcionare a continuacion. ¡Estoy aqui para ayudarte en cada paso!', null, async (_, { state, flowDynamic }) => {
        const allState = state.getMyState()
        await flowDynamic(`Los datos recopilados son tu nombre: ${allState.name}, y tu Numero #A: ${allState.NumeroA}.`)
        
      })
      .addAnswer(
        [
            "> MENU",
            "",
            "1️⃣ Recepción de Consultas Generales", 
            "2️⃣ Fechas de Corte (Fechas de Audiencia)",
            "3️⃣ Consultas y Formulación de su Permiso de Trabajo",
            "4️⃣ Huellas Biométricas, Cita, Programación y Reprogramación",
            "Para seleccionar una opción, simplemente responde con el número correspondiente."
        ].join('\n'),
        { delay: 800, capture: true },
        async (ctx, { fallBack ,state }) => {
            state.clear;
            const validOptions = ["1", "2", "3", "4"];
    
            if (!validOptions.includes(ctx.body)) {
                return fallBack("Por favor, selecciona una opción válida del menú");
            }
        },[HuellasBiometricas, PermisoTrabajo, FechasCorte, RecepcionConsultas]
    );

const main = async () => {
    const adapterFlow = createFlow([formularioFinal])
    const adapterProvider = createProvider(Provider)
        const adapterDB = new Database({
        dbUri: "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5",
        dbName: "ColombiaBot",
    })

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    

    httpServer(+PORT)
}

main()
