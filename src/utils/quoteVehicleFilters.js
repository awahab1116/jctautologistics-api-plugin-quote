const VEHICLE_PLUGIN_FILTERS = [
  "vehicleYear",
  "vehicleMake",
  "vehicleModel",
  "type",
];

export default function vehicleFilterQuery(data) {
  const newObj = {};

  if (data) {
    for (const filter of data) {
      if (VEHICLE_PLUGIN_FILTERS.includes(filter.name)) {
        // console.log("Filter Name ", filter.name)
        let { value } = filter;
        // Ensure that documents where the filter field is
        // not set are also returned.

        newObj[`${filter.name}`] = value;
        //   { [`${filter.name}`]: value }
        // filters.vehicleMake = userVehicleMake;
      }
    }
  }

  console.log("new Obj is ", newObj);

  return newObj;
}
