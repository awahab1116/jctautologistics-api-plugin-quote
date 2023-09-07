const QUOTE_PLUGIN_SIMPLE_FILTERS = ["transportType", "serviceType"];
const QUOTE_PLUGIN_LOCATION_FILTERS_FILTERS = ["quoteTo", "quoteFrom"];

/**
 *
 * @method xformQuoteSimpleFilters
 * @memberof Quote
 * @summary Transforms a boolean filters array into a mongo filter expression
 * @param {Object} context - an object containing per-request state
 * @param {Object[]} simpleFilters - Array of Boolean filters
 * @returns {Object} Mongo filter expression
 */
export default async function xformQuoteSimpleFilters(context, simpleFilters) {
  const mongoFilters = [];

  console.log("Simple Filter for mongo ", simpleFilters);
  // Catalog plugin's filters, if any
  for (const filter of simpleFilters) {
    if (QUOTE_PLUGIN_SIMPLE_FILTERS.includes(filter.name)) {
      // console.log("Filter Name ", filter.name)
      let { value } = filter;
      // Ensure that documents where the filter field is
      // not set are also returned.
      if (value === false) value = { $ne: true };
      mongoFilters.push({ [`${filter.name}`]: value });
    }

    if (QUOTE_PLUGIN_LOCATION_FILTERS_FILTERS.includes(filter.name)) {
      console.log("in location filter");
      let { value } = filter;
      // Ensure that documents where the filter field is
      // not set are also returned.
      if (value === false) value = { $ne: true };
      mongoFilters.push({ [`${filter.name}.city`]: value });
    }
  }

  console.log("Mongofilter is ", mongoFilters);

  // console.log("mongoFilters ", mongoFilters)
  // Provide the opportunity for other plugins to add simple filters
  for (const func of context.getFunctionsOfType("xformQuoteSimpleFilters")) {
    const additionalMongoFilters = await func(context, simpleFilters); // eslint-disable-line no-await-in-loop
    if (additionalMongoFilters) {
      // Merge all filters
      Array.prototype.push.apply(mongoFilters, additionalMongoFilters);
    }
    // console.log("additional Mongo Filters ", additionalMongoFilters)
  }
  // console.log(additionalMongoFilters)

  if (mongoFilters.length === 0) return {};
  // console.log("mongo Filters ", mongoFilters)
  return {
    $and: mongoFilters,
  };
}
