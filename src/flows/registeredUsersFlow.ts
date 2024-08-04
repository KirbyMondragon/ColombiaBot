import {  addKeyword, EVENTS } from '@builderbot/bot'

// Flow of registered users
const registeredUsersFlow = addKeyword(EVENTS.ACTION).addAction(
  { delay: 3000 },
  async (_, { state, flowDynamic }) => {
    const name = await state.get("Name");
    await flowDynamic(`Hello ${name}! How can I help you?`);
    return;
  }
);

export default registeredUsersFlow;
