import fs from "fs";
import csv from "csv-parser";

const parseArray = (arrayString) => {
  try {
    // Remove the surrounding single quotes and whitespace
    const trimmedString = arrayString.trim().slice(1, -1);
    // Split the remaining string by commas and trim each item
    const arrayValues = trimmedString.split(",").map((value) => {
      const trimmedValue = value.trim();
      if (
        trimmedValue.startsWith("'") &&
        trimmedValue.endsWith("'") &&
        trimmedValue.length > 1
      ) {
        // Remove the surrounding single quotes
        return trimmedValue.slice(1, -1);
      } else if (
        trimmedValue.startsWith('"') &&
        trimmedValue.endsWith('"') &&
        trimmedValue.length > 1
      ) {
        // Remove the surrounding double quotes
        return trimmedValue.slice(1, -1);
      } else {
        return trimmedValue;
      }
    });
    return arrayValues;
  } catch (err) {
    console.error("Error parsing array:", err);
    return [];
  }
};

export default async function getVehicleMake(context, { start } = {}) {
  const { appEvents, collections, simpleSchemas } = context;
  const { Product } = simpleSchemas;
  const { Quotes, Vehicles, VehiclesNew } = collections;

  const csvFilePath =
    "/home/awahab1116/autotransport/reaction-backend/custom-packages/jctautologistics-api-plugin-quote/src/queries/final_testing.csv";

  //   "/home/awahab1116/autotransport/reaction-backend/custom-packages/jctautologistics-api-plugin-quote/src/queries/testing_jct_data.csv";
  // console.log("In query inner function ");

  // try {
  //   // Connect to MongoDB

  //   // Read CSV file

  //   fs.createReadStream(csvFilePath)
  //     .pipe(csv())
  //     .on("data", async (data) => {
  //       data.body_types = parseArray(data.body_types);
  //       console.log("Here in insert ", data); // Insert each row of data into the collection
  //       await VehiclesNew.insertOne(data);
  //     })
  //     .on("end", () => {
  //       console.log("Data inserted successfully!");
  //       // Close the MongoDB connection
  //     });
  // } catch (err) {
  //   console.error("Error: ", err);
  // }

  const uniqueValues = await VehiclesNew.distinct("make");

  // Print the unique values
  console.log(uniqueValues);

  return uniqueValues;
}
