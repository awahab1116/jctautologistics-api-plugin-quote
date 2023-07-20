export default async function getQuoteById(context, { id } = {}) {
  const { appEvents, collections, simpleSchemas } = context;
  const { Quotes, Vehicles } = collections;

  console.log("Quote ID is inner function ", id);

  //let quote = await Quotes.findOne({ _id: id });

  //console.log("Quote is ", quote);

  return Quotes.findOne({ _id: id });
}
