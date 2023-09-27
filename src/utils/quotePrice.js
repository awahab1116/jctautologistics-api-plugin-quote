import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";

export async function calculateQuotePrice(context, quote, vehicle) {
  let priceModel;
  let straightFee = 0;
  let finalPrice = 0;
  let isDiscount = true;
  const { collections } = context;
  const { Quotes } = collections;
  //const { data, shopId, serviceProductId, variant, quote, vehicle } = input;

  let quoteObj = await Quotes.findOne({
    quotePersonEmail: quote.quotePersonEmail,
    isDiscount: true,
  });

  console.log("Quote obj is ", quoteObj);

  if (quoteObj) {
    console.log("Not giving discount");
    //don't give discount
    isDiscount = false;
  }

  const smallVehicleTypes = [
    "Cabriolet",
    "Convertible",
    "Coupe",
    "Hatchback",
    "Roadster",
    "Sedan",
    "Sports_Car",
    "Station_Wagon",
  ];

  const largeVehicleTypes = [
    "Crossover",
    "Grand_tourer",
    "Pickup",
    "SUV",
    "Van",
  ];

  if (smallVehicleTypes.includes(vehicle.type)) {
    priceModel = "smallvehicles";
  } else if (largeVehicleTypes.includes(vehicle.type)) {
    priceModel = "largevehicles";
  } else {
    // Handle the case for unknown vehicle type
    throw new ReactionError(
      "invalid-parameter",
      "Invalid vehicle type. Please provide a valid vehicle type"
    );
  }

  // if (
  //   vehicle.type === "car" ||
  //   vehicle.type === "smallsuv" ||
  //   vehicle.type === "midsuv"
  // ) {
  //   priceModel = "smallvehicles";
  // } else if (
  //   vehicle.type === "largesuv" ||
  //   vehicle.type === "truck" ||
  //   vehicle.type === "van"
  // ) {
  //   priceModel = "largevehicles";
  // } else {
  //   // Handle the case for unknown vehicle type

  //   throw new ReactionError(
  //     "invalid-parameter",
  //     "Invalid vehicle type. Please provide a valid vehicle type"
  //   );
  // }

  if (quote.distance >= 0 && quote.distance <= 50) {
    straightFee = priceModel === "smallvehicles" ? 275 : 325;
  } else if (quote.distance >= 51 && quote.distance <= 100) {
    straightFee = priceModel === "smallvehicles" ? 350 : 400;
  } else if (quote.distance >= 101 && quote.distance <= 150) {
    straightFee = priceModel === "smallvehicles" ? 375 : 450;
  } else if (quote.distance >= 151 && quote.distance <= 300) {
    straightFee =
      priceModel === "smallvehicles"
        ? 1.25 * quote.distance
        : 1.45 * quote.distance;
  } else if (quote.distance >= 301 && quote.distance <= 900) {
    straightFee =
      priceModel === "smallvehicles"
        ? 1.15 * quote.distance
        : 1.35 * quote.distance;
  } else if (quote.distance >= 901) {
    straightFee =
      priceModel === "smallvehicles"
        ? 0.95 * quote.distance
        : 1.1 * quote.distance;
  } else {
    // Handle the case for unknown distance

    throw new ReactionError("invalid-parameter", "Invalid distance");
  }

  finalPrice = straightFee;

  if (quote.cargoType === "enclosed") {
    finalPrice +=
      priceModel === "smallvehicles" ? straightFee * 0.5 : straightFee * 0.65;
  }

  if (quote.isExpedited) {
    finalPrice += straightFee * 0.35;
  }

  if (!quote.isOperable) {
    finalPrice += 100;
  }

  console.log("Before discount price ", finalPrice);
  //to be changed discount value
  if (isDiscount) {
    let discountPercentage = 5;
    const discountAmount = (finalPrice * discountPercentage) / 100;
    finalPrice = finalPrice - discountAmount;
    console.log("After discount price is ", finalPrice);
  }

  console.log("FInal price typeof ", typeof finalPrice);

  console.log("typeof parse float ", typeof parseFloat(finalPrice.toFixed(2)));

  return parseFloat(finalPrice.toFixed(2));
}

/*


Below are the parameters for our pricing model. If you need any further clarification, I’d be happy to get on a call.
Standard Pricing (3+ days until pickup, once order is submitted)

50 miles or less = straight fee of $275 for car and small-mid size SUV (escape, terrain, etc.).
Straight fee of $325 for trucks, vans, and large SUVs (yukon, escalade, etc)

51-100 miles = Straight fee $350 for cars/small/mid SUVS. Straight fee of $400 for trucks, vans, large SUVs.

101-150 miles = Straight fee $375 for cars/small/mid SUVS. Straight fee of $450 for trucks, vans, large SUVs.

151-900 miles = Straight fee of $375, unless per mile cost exceeds straight fee, then $1.25 per mile for cars/small/mid SUVS.
Straight fee of $450, unless per mile cost exceeds straight fee, then $1.50 per mile for trucks, vans, large SUVs.

901-1500 miles = $1.25 per mile for cars/small/mid SUVS. $1.45 per mile for trucks, vans, large SUVs.

1501-2000 miles = $1.15 per mile for cars/small/mid SUVS. $1.35 per mile for trucks, vans, large SUVs.

2001+ miles = $0.95 per mile for cars/small/mid SUVS. $1.10 per mile for trucks, vans, large SUVs.


Special Pricing Conditions

50% increase from straight fee/mileage for enclosed for cars/small/mid SUVS.

65% increase from straight fee/mileage for enclosed for trucks, vans, large SUVs.

35% increase from straight fee or mileage cost for expedited (pick-up within 2 days of order).

If customer wants expedited and enclosed, then 35% increase from straight fee/mileage from the enclosed cost = expedited+enclosed price.

Inoperable vehicle = $100 straight fee + standard pricing (unless special pricing applies).


*/
