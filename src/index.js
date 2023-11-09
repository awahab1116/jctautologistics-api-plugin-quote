import pkg from "../package.json";
import mutations from "./mutations/index.js";
import queries from "./queries/index.js";
import resolvers from "./resolvers/index.js";
import schemas from "./schemas/index.js";

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "Quotes",
    name: "quotes",
    version: pkg.version,
    collections: {
      Quotes: {
        name: "Quotes",
      },
      Vehicles: {
        name: "Vehicles",
      },
      VehiclesNew: {
        name: "VehiclesNew",
      },
      OrderNumber: {
        name: "OrderNumber",
      },
    },

    graphQL: {
      resolvers,
      schemas,
    },
    mutations,
    queries,
  });
}
