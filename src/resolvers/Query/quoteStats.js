import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import xformQuoteBooleanFilters from "../../utils/quoteBooleanFilters.js";
import xformQuoteSimpleFilters from "../../utils/quoteSimpleFilters.js";
import ReactionError from "@reactioncommerce/reaction-error";

export default async function quoteStats(_, args, context, info) {
  console.log("IN main function");

  let getQuotesReport = await context.queries.quoteStats(context, {});

  console.log("before return");

  return getQuotesReport;
}
