export default async function getVehicleModels(context, { make } = {}) {
  const { appEvents, collections, simpleSchemas } = context;
  const { Product } = simpleSchemas;
  const { Quotes, Vehicles, VehiclesNew } = collections;

  console.log("In query inner function ", make);

  const vehicleMakes = await VehiclesNew.find({ make }).toArray();
  console.log("Vehicle Makes are ", vehicleMakes);

  return vehicleMakes;
}
