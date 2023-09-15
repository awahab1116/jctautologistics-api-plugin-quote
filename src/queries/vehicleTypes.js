export default async function vehicleTypes(context, {} = {}) {
  const { appEvents, collections, simpleSchemas } = context;
  const { Product } = simpleSchemas;
  const { Quotes, VehiclesNew } = collections;

  const uniqueBodyTypes = await VehiclesNew.distinct("body_types");
  console.log("Body types are ", uniqueBodyTypes);

  return uniqueBodyTypes;
}
