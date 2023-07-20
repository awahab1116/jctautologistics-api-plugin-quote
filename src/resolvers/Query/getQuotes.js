import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import xformQuoteBooleanFilters from "../../utils/quoteBooleanFilters.js";
import xformQuoteSimpleFilters from "../../utils/quoteSimpleFilters.js";
import ReactionError from "@reactioncommerce/reaction-error";

export default async function getQuotes(_, args, context, info) {
  console.log("IN main function");
  const {
    booleanFilters,
    simpleFilters,
    floatRange,
    searchQuery,
    vehicleFilter,
    ...connectionArgs
  } = args;

  //console.log("context ", context);

  if (!context?.authToken) {
    throw new ReactionError(
      "access-denied",
      `Cannot get Quotes,AuthToken required`
    );
  }

  console.log("before quote boolean filter");

  let quoteBooleanFilters = {};
  if (Array.isArray(booleanFilters) && booleanFilters.length) {
    console.log("in boolean filter");
    quoteBooleanFilters = await xformQuoteBooleanFilters(
      context,
      booleanFilters
    );
  }

  let quoteSimpleFilters = {};
  if (Array.isArray(simpleFilters) && simpleFilters.length) {
    quoteSimpleFilters = await xformQuoteSimpleFilters(context, simpleFilters);
  }

  console.log("after quote boolean filter");

  let getQuotesReport = await context.queries.getQuotes(context, {
    quoteBooleanFilters,
    quoteSimpleFilters,
    connectionArgs,
    searchQuery,
    vehicleFilter,
    floatRange,
  });

  //console.log("return getQuotes are ", getQuotesReport);
  console.log("before return");

  return getPaginatedResponse(getQuotesReport, connectionArgs, {
    includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
    includeHasPreviousPage: wasFieldRequested("pageInfo.hasPreviousPage", info),
    includeTotalCount: wasFieldRequested("totalCount", info),
  });
}
