export default async function updateQuote(_, { input }, context) {
  const { quoteId, vehicle, quote, shopId, serviceProductId } = input;

  console.log("In started update quote");
  const updatedQuote = await context.mutations.updateQuote(context, {
    quoteId,
    vehicle,
    quote,
    shopId,
    serviceProductId,
  });

  return updatedQuote;
}
