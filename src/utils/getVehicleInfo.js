import { encodeProductOpaqueId } from "../xforms/id.js";

export default async function getVehicleInfo(
  context,
  quoteId,
  vehicleId,
  topOnly,
  args
) {
  const { Vehicles } = context.collections;

  console.log("Vehicle parent id is ", vehicleId);

  console.log("in vehicle reslover function");

  console.log("arguments are ", args);

  const vehiclesData = await Vehicles.findOne({
    _id: vehicleId,
  });

  vehiclesData._id = encodeProductOpaqueId(vehiclesData._id);
  // console.log("Vehicles data is ", vehiclesData);
  return vehiclesData;
}
