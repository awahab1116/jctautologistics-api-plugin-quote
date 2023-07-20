import SimpleSchema from "simpl-schema";
// import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import { decodeProductOpaqueId, decodeShopOpaqueId } from "../xforms/id.js";
import Random from "@reactioncommerce/random";
import { sendGeneratedQuoteEmail } from "../utils/quoteEmail.js";
import { calculateQuotePrice } from "../utils/quotePrice.js";

export default async function updateQuote(context, input) {
  const { appEvents, collections, simpleSchemas } = context;
  const { Quotes, Vehicles } = collections;
  const { quoteId, quote, vehicle, shopId, serviceProductId } = input;

  if (!quoteId) {
    throw new ReactionError("invalid-parameter", "Please provide Quote ID");
  }

  console.log("quote Id", quoteId);
  let id = decodeOpaqueId(quoteId).id;
  console.log("encoded quote Id", id);
  console.log("quote date ", quote);
  console.log("vehicle data ", vehicle);

  let updatedvehicle;
  let updatedQuote;
  try {
    const data = await Quotes.findOne({ _id: id });
    console.log("data is ", data);

    if (!data) {
      throw new ReactionError(
        "invalid-parameter",
        "Provided Quote ID is invalid"
      );
    }

    let quotePrice = await calculateQuotePrice(context, quote, vehicle);
    let variant = {};
    variant.price = quotePrice;

    console.log("vehicle Id is ", data.vehicleId);
    let vehicleId = data.vehicleId;
    updatedvehicle = await Vehicles.findOneAndUpdate(
      { _id: vehicleId },
      { $set: vehicle },
      { new: true }
    );

    quote.price = quotePrice;
    updatedQuote = await Quotes.findOneAndUpdate(
      { _id: id },
      { $set: quote },
      { new: true }
    );

    const updatedVariant = await context.mutations.updateProductVariant(
      context,
      {
        variantId: decodeProductOpaqueId(id),
        shopId: decodeShopOpaqueId(shopId),
        variant,
      }
    );

    let decodedServiceProductId = decodeProductOpaqueId(serviceProductId);

    let internalProductIds = [];
    internalProductIds.push(decodedServiceProductId);

    let publishQuoteProduct = await context.mutations.publishProducts(
      context,
      internalProductIds
    );

    console.log("update variant is ", updatedVariant);
    console.log("published product is ", publishQuoteProduct);
    console.log("update Quote is ", updatedQuote);
    console.log("updated Vehicke is ", updatedvehicle);

    return true;
  } catch (err) {
    console.log("error is ", err);
    throw new ReactionError("server-error", "Something went wrong");
  }
}
