import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import xformQuoteBooleanFilters from "../../utils/quoteBooleanFilters.js";
import xformQuoteSimpleFilters from "../../utils/quoteSimpleFilters.js";
import ReactionError from "@reactioncommerce/reaction-error";

export default async function quoteGraphStats(_, args, context, info) {
  console.log("IN main function");
  const { year } = args;
  console.log("IN main function ", year);

  let getQuotesReport = await context.queries.quoteGraphStats(context, {
    year,
  });

  console.log("before return");

  return getQuotesReport;
}
