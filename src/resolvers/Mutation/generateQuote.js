export default async function generateQuote(_, { input }, context) {
  const {
    shopId,
    serviceProductId,
    vehicle,
    quote,
    //   clientMutationId = null,
    //   product: productInput,
    //   shopId,
    //   shouldCreateFirstVariant
  } = input;

  // if (productInput && Array.isArray(productInput.tagIds)) {
  //   productInput.hashtags = productInput.tagIds.map(decodeTagOpaqueId);
  //   delete productInput.tagIds;
  // }

  let variant = {
    title: "Quote variant",
    attributeLabel: "Red,Large",
  };

  if (quote.quotePersonEmail) {
    quote.quotePersonEmail = quote.quotePersonEmail.toLowerCase();
  }

  console.log("In started quote shown user");
  const generatedQuote = await context.mutations.generateQuote(context, {
    shopId,
    serviceProductId,
    variant,
    vehicle,
    quote,
  });

  console.log("generated quote is ", generatedQuote);
  console.log("check plugin added");

  return generatedQuote;
}
