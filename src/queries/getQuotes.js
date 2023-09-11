import checkMinMaxExists from "../utils/defaultMinMaxRange.js";
import vehicleFilterQuery from "../utils/quoteVehicleFilters.js";

export default async function getQuotes(
  context,
  {
    searchQuery,
    floatRange,
    shopIds,
    tagIds,
    quoteBooleanFilters,
    quoteSimpleFilters,
    vehicleFilter,
  } = {}
) {
  const { appEvents, collections, simpleSchemas } = context;
  const { Product } = simpleSchemas;
  const { Quotes, Vehicles } = collections;

  console.log("in context queries boolean filter ", quoteBooleanFilters);
  console.log("in context queries string filter", quoteSimpleFilters);

  const query = {
    // "product.isDeleted": { $ne: true },
    ...quoteBooleanFilters,
    ...quoteSimpleFilters,
  };

  if (checkMinMaxExists(floatRange, "minPrice", "maxPrice")) {
    console.log("Both min and max price exists");

    const minPrice = floatRange.find((item) => item.name === "minPrice").value;
    const maxPrice = floatRange.find((item) => item.name === "maxPrice").value;
    // const searchQuery1 = `${minPrice} ${maxPrice}`;

    query[`price`] = { $gte: parseFloat(minPrice) };
    query[`price`] = { $lte: parseFloat(maxPrice) };
  }

  if (checkMinMaxExists(floatRange, "minDistance", "maxDistance")) {
    console.log("Both min and max distance exists");

    const minDistance = floatRange.find(
      (item) => item.name === "minDistance"
    ).value;
    const maxDistance = floatRange.find(
      (item) => item.name === "maxDistance"
    ).value;
    // const searchQuery1 = `${minPrice} ${maxPrice}`;

    query[`distance`] = { $gte: parseFloat(minDistance) };
    query[`distance`] = { $lte: parseFloat(maxDistance) };
  }

  console.log("vehicle filter input is ", vehicleFilter);

  console.log("Query is ", query);
  let filters = vehicleFilterQuery(vehicleFilter);
  console.log("Vehicle Filters are ", filters);

  // Construct the final query object based on the provided filters

  if (filters) {
    query[`vehicleId`] = {
      $in: await Vehicles.distinct("_id", filters),
    };
  }

  console.log("Query is ", query);

  console.log("context user is ", context.account);
  console.log("user role is ", context.account.userRole);

  let quotesQuery = {};
  if (
    !context?.account?.adminUIShopIds &&
    context?.account?.userRole == "user"
  ) {
    console.log("email is ", context.account.emails[0].address);
    console.log("This is simple user");

    query["quotePersonEmail"] = context.account.emails[0].address;
  } else if (context?.account?.userRole == "admin") {
    console.log("in admin check quotes");
    query["assignedTo.email"] = context.account.emails[0].address;
  } else {
    console.log("This is admin ", context?.account?.adminUIShopIds);
  }

  console.log("new query is ", query);

  return Quotes.find(query);
}
