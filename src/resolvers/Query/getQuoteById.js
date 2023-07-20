import { decodeProductOpaqueId, decodeShopOpaqueId } from "../../xforms/id.js";

export default async function getQuoteById(_, args, context, info) {
  const { id } = args;

  console.log("IN main function quote by id ", id);

  let getQuotesByID = await context.queries.getQuoteById(context, {
    id: decodeProductOpaqueId(id),
  });

  console.log("Returned data is ", getQuotesByID);

  return {
    quote: getQuotesByID,
  };
}
