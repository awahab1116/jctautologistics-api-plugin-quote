import SimpleSchema from "simpl-schema";
// import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import { decodeProductOpaqueId, decodeShopOpaqueId } from "../xforms/id.js";
import { encodeProductOpaqueId } from "../xforms/id.js";
import Random from "@reactioncommerce/random";
import { sendGeneratedQuoteEmail } from "../utils/quoteEmail.js";
import { calculateQuotePrice } from "../utils/quotePrice.js";

export default async function quoteGraphStats(context, input) {
  // inputSchema.validate(input);

  const { appEvents, collections, simpleSchemas } = context;
  const { Product } = simpleSchemas;
  const { Products, Quotes, Vehicles } = collections;
  //const { product: productInput, shopId, shouldCreateFirstVariant = true } = input;
  const { year: currentYear } = input;

  // console.log("I'asdsadm here ", year);

  // const currentYear = new Date().getFullYear();
  console.log("typeof current Year ", currentYear, typeof currentYear);

  // Create an array to hold counts for all months, initializing them to 0
  const countsForAllMonths = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    count: 0,
  }));

  console.log("countForAllMonths are ", countsForAllMonths);

  // Use MongoDB aggregation to group orders by month for the current year
  const result = await Quotes.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" }, // Group by month directly
        count: { $sum: 1 },
      },
    },
  ]).toArray();

  // Populate the counts for the months with orders
  result.forEach((item) => {
    const monthIndex = item._id - 1; // MongoDB months are 1-indexed
    countsForAllMonths[monthIndex].count = item.count;
  });

  console.log("hebkbda asss ", countsForAllMonths);

  return countsForAllMonths;
}
