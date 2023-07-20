export default async function getVehicleModels(_, args, context, info) {
  const { make } = args;
  console.log("IN main function ", make);

  let getQuotesReport = await context.queries.getVehicleModels(context, {
    make,
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
