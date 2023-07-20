import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import xformQuoteBooleanFilters from "../../utils/quoteBooleanFilters.js";
import xformQuoteSimpleFilters from "../../utils/quoteSimpleFilters.js";
import ReactionError from "@reactioncommerce/reaction-error";

export default async function getVehicleMake(_, args, context, info) {
  console.log("IN main function");

  let getQuotesReport = await context.queries.getVehicleMake(context, {
    start: true,
  });

  //console.log("return getQuotes are ", getQuotesReport);
  console.log("before return");

  return getQuotesReport;
  //   return getPaginatedResponse(getQuotesReport, connectionArgs, {
  //     includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
  //     includeHasPreviousPage: wasFieldRequested("pageInfo.hasPreviousPage", info),
  //     includeTotalCount: wasFieldRequested("totalCount", info),
  //   });
}
