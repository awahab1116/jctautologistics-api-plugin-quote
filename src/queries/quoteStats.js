import SimpleSchema from "simpl-schema";
// import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import { decodeProductOpaqueId, decodeShopOpaqueId } from "../xforms/id.js";
import { encodeProductOpaqueId } from "../xforms/id.js";
import Random from "@reactioncommerce/random";
import { sendGeneratedQuoteEmail } from "../utils/quoteEmail.js";
import { calculateQuotePrice } from "../utils/quotePrice.js";

// Function to add "true" and "false" objects with count 0 if they don't exist
function verifyResponseData(data) {
  const idValues = [true, false];
  console.log("Data is ", data);

  idValues.forEach((id) => {
    const isApprovedCountExists = data?.approvedCounts.find(
      (item) => item._id === id
    );
    const isStripePaymentStatusExists = data?.stripePaymentStatus.find(
      (item) => item._id === id
    );

    console.log("isApprovedCount ", isApprovedCountExists);
    console.log("isStripePayment ", isStripePaymentStatusExists);

    if (!isApprovedCountExists) {
      data?.approvedCounts.push({ _id: id, count: 0 });
    }

    if (!isStripePaymentStatusExists) {
      data?.stripePaymentStatus.push({ _id: id, count: 0 });
    }
  });

  if (!data?.sumOfPricesWithStripePayment.length) {
    data?.sumOfPricesWithStripePayment.push({ _id: "sumPrice", value: 0 });
  }

  console.log("data is ", data);

  return data;
}

export default async function quoteStats(context, input) {
  // inputSchema.validate(input);

  const { appEvents, collections, simpleSchemas } = context;
  const { Product } = simpleSchemas;
  const { Products, Quotes, Vehicles } = collections;
  //const { product: productInput, shopId, shouldCreateFirstVariant = true } = input;
  const { shopId, serviceProductId, variant, quote, vehicle } = input;

  let query = { isApproved: true, stripePaymentStatus: true };

  const noQuotes = await Quotes.countDocuments();
  console.log("I'm here ", noQuotes);

  const noApprovedOrders = await Quotes.aggregate([
    {
      $facet: {
        approvedCounts: [
          {
            $group: {
              _id: "$isApproved",
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              _id: { $in: [true, false] },
            },
          },
          {
            $group: {
              _id: "$_id",
              count: { $first: "$count" },
            },
          },
        ],
        stripePaymentStatus: [
          {
            $group: {
              _id: "$stripePaymentStatus",
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              _id: { $in: [true, false] },
            },
          },
          {
            $group: {
              _id: "$_id",
              count: { $first: "$count" },
            },
          },
        ],
        sumOfPricesWithStripePayment: [
          {
            $match: {
              stripePaymentStatus: true,
            },
          },
          {
            $group: {
              _id: "sumPrice",
              value: { $sum: "$price" },
            },
          },
        ],
      },
    },
    // {
    //   $project: {
    //     approvedCounts: { $arrayElemAt: ["$approvedCounts", 1] },
    //     stripePaymentStatus: { $arrayElemAt: ["$stripePaymentStatus", 1] },
    //     sumOfPricesWithStripePayment: {
    //       $arrayElemAt: ["$sumOfPricesWithStripePayment", 0],
    //     },
    //   },
    // },

    // {
    //   $group: {
    //     _id: "$isApproved",
    //     count: { $sum: 1 },
    //   },
    // },
  ]).toArray();

  let response = verifyResponseData(noApprovedOrders[0]);

  console.log("whole data is ", response[0]);
  console.log("data is ", response.approvedCounts);
  console.log("data is ", response.stripePaymentStatus);
  console.log("data is ", response.sumOfPricesWithStripePayment);

  return {
    noOrders: noQuotes,
    isApprovedQuoteCount: response?.approvedCounts
      ? response?.approvedCounts
      : [],
    isStripePaymentStatus: response?.stripePaymentStatus
      ? response?.stripePaymentStatus
      : [],
    sumOfPricesWithStripePayment: response?.sumOfPricesWithStripePayment
      ? response?.sumOfPricesWithStripePayment
      : [],
  };
}
