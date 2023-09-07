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
    "/home/awahab1116/autotransport/reaction-backend/custom-packages/jctautologistics-api-plugin-quote/src/queries/testing_jct_data_final.csv";

  //   "/home/awahab1116/autotransport/reaction-backend/custom-packages/jctautologistics-api-plugin-quote/src/queries/testing_jct_data.csv";
  // console.log("In query inner function ");

  // try {
  //   const insertPromises = [];
  //   fs.createReadStream(csvFilePath)
  //     .pipe(csv())
  //     .on("data", async (data) => {
  //       data.body_types = parseArray(data.body_types);
  //       console.log("Here in insert ", data);
  //       insertPromises.push(VehiclesNew.insertOne(data)); // Use your collection to insert data
  //     })
  //     .on("end", async () => {
  //       try {
  //         await Promise.all(insertPromises); // Wait for all inserts to complete
  //         console.log("Data inserted successfully!");
  //       } catch (err) {
  //         console.error("Error inserting data: ", err);
  //       } finally {
  //         // Close the MongoDB connection
  //         // await client.close();
  //       }
  //     });
  // } catch (err) {
  //   console.error("Error: ", err);
  // }

  const uniqueValues = await VehiclesNew.distinct("make");

  // const countVehicle = await VehiclesNew.countDocuments();
  // console.log("count Vehicles are ", countVehicle);

  // const uniqueBodyTypes = await VehiclesNew.distinct("body_types");
  // console.log("Body types are ", uniqueBodyTypes);

  // // Print the unique values
  // console.log(uniqueValues);

  return uniqueValues;

  // return [];
}
