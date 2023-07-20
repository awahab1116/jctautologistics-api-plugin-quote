import SimpleSchema from "simpl-schema";
// import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import { decodeProductOpaqueId, decodeShopOpaqueId } from "../xforms/id.js";
import { encodeProductOpaqueId } from "../xforms/id.js";
import Random from "@reactioncommerce/random";
import { sendGeneratedQuoteEmail } from "../utils/quoteEmail.js";
import { calculateQuotePrice } from "../utils/quotePrice.js";
// import cleanProductInput from "../utils/cleanProductInput.js";

// const inputSchema = new SimpleSchema({
//   product: {
//     type: Object,
//     blackbox: true,
//     optional: true
//   },
//   shopId: String,
//   shouldCreateFirstVariant: {
//     type: Boolean,
//     optional: true
//   }
// });

export default async function generateQuote(context, input) {
  // inputSchema.validate(input);

  const { appEvents, collections, simpleSchemas } = context;
  const { Product } = simpleSchemas;
  const { Products, Quotes, Vehicles } = collections;
  //const { product: productInput, shopId, shouldCreateFirstVariant = true } = input;
  const { shopId, serviceProductId, variant, quote, vehicle } = input;

  let quotePrice = await calculateQuotePrice(context, quote, vehicle);
  console.log("Calculated price is ", quotePrice);

  console.log("In actuat mutation function hidden function");

  console.log("Variant is ", variant);

  variant.price = quotePrice;

  console.log("typeof ", typeof quotePrice);

  let quoteVarient = await context.mutations.createProductVariant(
    context.getInternalContext(),
    {
      productId: decodeProductOpaqueId(serviceProductId),
      shopId: decodeShopOpaqueId(shopId),
      variant,
    }
  );

  console.log("New created variant is ", quoteVarient);
  console.log("Vehicle is ", vehicle);

  const newVehicleId = Random.id();
  const newVehicle = {
    _id: newVehicleId,
    ...vehicle,
  };

  console.log("new Vehicle obj is ", newVehicle);

  let addedVehicle = await Vehicles.insertOne(newVehicle);

  console.log("Added Vehicle is ", addedVehicle);

  const createdAt = new Date();
  const newQuote = {
    _id: quoteVarient._id,
    createdAt,
    ...quote,
    vehicleId: newVehicle._id,
    price: quotePrice,
    isDiscount: false,
    loadStatus: "open",
    isApproved: false,
  };
  //console.log("Quote is ", quote);
  //console.log("new Quote obj is ", newQuote);

  let addedQuote = await Quotes.insertOne(newQuote);

  console.log("Added Quote is ", addedQuote);

  let decodedServiceProductId = decodeProductOpaqueId(serviceProductId);

  let internalProductIds = [];
  internalProductIds.push(decodedServiceProductId);

  let publishQuoteProduct = await context.mutations.publishProducts(
    context,
    internalProductIds
  );

  console.log(
    "New published product after new variant added ",
    publishQuoteProduct
  );

  let sentQuote = await sendGeneratedQuoteEmail(
    context,
    quote,
    vehicle,
    quotePrice,
    "temp"
  );
  //console.log("Generated Quote Email response is ", sentQuote);

  let isQuoteGenerated = addedQuote?.result?.ok ? true : false;
  let quoteID = "";
  if (isQuoteGenerated) {
    quoteID = encodeProductOpaqueId(quoteVarient._id);
  }
  console.log("is quote generated ", isQuoteGenerated);
  console.log("quote encoded id is check ", quoteID);

  return {
    isQuoteAdded: isQuoteGenerated,
    quoteId: quoteID,
  };
}
