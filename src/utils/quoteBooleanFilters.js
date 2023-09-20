const QUOTE_PLUGIN_BOOLEAN_FILTERS = [
  "isOperable",
  "isDiscount",
  "isApproved",
  "stripePaymentStatus",
  "isCompleted",
];

/**
 *
 * @method xformQuoteBooleanFilters
 * @memberof Quote
 * @summary Transforms a boolean filters array into a mongo filter expression
 * @param {Object} context - an object containing per-request state
 * @param {Object[]} booleanFilters - Array of Boolean filters
 * @returns {Object} Mongo filter expression
 */
export default async function xformQuoteBooleanFilters(
  context,
  booleanFilters
) {
  console.log("in xform quote boolean function");

  const mongoFilters = [];

  // Quote plugin's filters, if any
  for (const filter of booleanFilters) {
    if (QUOTE_PLUGIN_BOOLEAN_FILTERS.includes(filter.name)) {
      let { value } = filter;
      // Ensure that documents where the filter field is
      // not set are also returned.
      if (value === false) value = { $ne: true };
      mongoFilters.push({ [`${filter.name}`]: value });
    }
  }

  // Provide the opportunity for other plugins to add boolean filters
  for (const func of context.getFunctionsOfType("xformQuoteBooleanFilters")) {
    const additionalMongoFilters = await func(context, booleanFilters); // eslint-disable-line no-await-in-loop
    if (additionalMongoFilters) {
      // Merge all filters
      Array.prototype.push.apply(mongoFilters, additionalMongoFilters);
    }
  }

  if (mongoFilters.length === 0) return {};

  return {
    $and: mongoFilters,
  };
}
