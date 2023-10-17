import checkMinMaxExists from "../utils/defaultMinMaxRange.js";
import vehicleFilterQuery from "../utils/quoteVehicleFilters.js";

function checkfilterObject(myObject) {
  if (Object.keys(myObject).length > 0) {
    console.log("object has keys ", myObject);
    return true;
  } else {
    console.log("myObject does not have any keys");
    return false;
  }
}

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

  let query = [];

  if (checkfilterObject(quoteBooleanFilters)) {
    query.push(quoteBooleanFilters);
  }
  if (checkfilterObject(quoteSimpleFilters)) {
    query.push(quoteSimpleFilters);
  }
  // query.push(quoteSimpleFilters);

  // const query = [
  //   // "product.isDeleted": { $ne: true },
  //   ...quoteBooleanFilters,
  //   ...quoteSimpleFilters,
  // ];

  if (searchQuery) {
    const vehicleIds = await collections.Vehicles.distinct("_id", {
      $or: [
        {
          vehicleMake: {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          vehicleModel: {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          vehicleYear: {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          type: {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
      ],
    });

    query.push({
      $or: [
        {
          vehicleId: {
            $in: vehicleIds,
          },
        },
        {
          "quoteTo.city": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "quoteTo.state": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "quoteTo.zip": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "quoteFrom.city": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "quoteFrom.state": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          "quoteFrom.zip": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
        {
          quoteOrderId: {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
      ],
    });
  }

  console.log("1293810923 query is ", query);
  if (checkMinMaxExists(floatRange, "minPrice", "maxPrice")) {
    console.log("Both min and max price exist");

    const minPrice = floatRange.find((item) => item.name === "minPrice").value;
    const maxPrice = floatRange.find((item) => item.name === "maxPrice").value;

    query.push({
      price: {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice),
      },
    });
  }
  if (checkMinMaxExists(floatRange, "minDistance", "maxDistance")) {
    console.log("Both min and max distance exist");

    const minDistance = floatRange.find(
      (item) => item.name === "minDistance"
    ).value;
    const maxDistance = floatRange.find(
      (item) => item.name === "maxDistance"
    ).value;

    query.push({
      distance: {
        $gte: parseFloat(minDistance),
        $lte: parseFloat(maxDistance),
      },
    });
  }

  console.log("Query is ", query);
  // let filters = vehicleFilterQuery(vehicleFilter);
  // console.log("Vehicle Filters are ", filters);

  // // Construct the final query object based on the provided filters

  // if (filters) {
  //   query[`vehicleId`] = {
  //     $in: await Vehicles.distinct("_id", filters),
  //   };
  // }

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

    query.push({
      quotePersonEmail: context.account.emails[0].address,
    });
  } else if (context?.account?.userRole == "admin") {
    console.log("in admin check quotes");
    query.push({
      "assignedTo.email": context.account.emails[0].address,
    });
  } else {
    console.log("This is admin ", context?.account?.adminUIShopIds);
  }

  console.log("new query is ", query);
  let newObj = {};
  if (query.length) {
    newObj = {
      $and: query,
    };
  }

  console.log("newobj is ", newObj);

  return Quotes.find(newObj);
}
