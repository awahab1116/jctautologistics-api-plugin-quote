import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";

export async function sendGeneratedQuoteEmail(
  context,
  generatedQuote,
  addedVehicle,
  price,
  msgIntro,
  { bodyTemplate = "accounts/generatedQuoteEmail", temp }
) {
  const {
    collections: { Accounts, Shops, users },
  } = context;

  console.log("In quote email function");

  const shop = await Shops.findOne({ shopType: "primary" });
  if (!shop) throw new ReactionError("not-found", "Shop not found");

  console.log("Quote data is ", generatedQuote);
  console.log("Vehicle data is ", addedVehicle);

  let shipTo = `${generatedQuote?.quoteTo?.city}, ${generatedQuote?.quoteTo?.state} ${generatedQuote?.quoteTo?.zip}`;
  let shipFrom = `${generatedQuote?.quoteFrom?.city}, ${generatedQuote?.quoteFrom?.state} ${generatedQuote?.quoteFrom?.zip}`;
  let vehicleData = `${addedVehicle?.vehicleMake} ${addedVehicle?.vehicleModel}`;

  console.log("");

  const dataForEmail = {
    // Reaction Information
    contactEmail: "awahab1116@gmail.com",
    homepage: _.get(shop, "storefrontUrls.storefrontHomeUrl", null),
    copyrightDate: new Date().getFullYear(),
    legalName: _.get(shop, "addressBook[0].company"),
    physicalAddress: {
      address: `${_.get(shop, "addressBook[0].address1")} ${_.get(
        shop,
        "addressBook[0].address2"
      )}`,
      city: _.get(shop, "addressBook[0].city"),
      region: _.get(shop, "addressBook[0].region"),
      postal: _.get(shop, "addressBook[0].postal"),
    },
    shopName: shop.name,
    quotePrice: price,
    distance: generatedQuote.distance,
    fromLocation: shipFrom,
    toLocation: shipTo,
    vehicle: `${addedVehicle?.vehicleYear} ${vehicleData}`,
    availableData: addedVehicle?.vehicleDesiredPickUp,
    serviceType: generatedQuote.serviceType,
    isOperable: generatedQuote.isOperable,
    transportType: generatedQuote.transportType,
    vehicleMakeModel: vehicleData,
    intro: msgIntro,
    userEmailAddress: "test@gmail.com",
  };
  const language = shop.language;

  return context.mutations.sendEmail(context, {
    data: dataForEmail,
    fromShop: shop,
    templateName: bodyTemplate,
    language,
    to: generatedQuote.quotePersonEmail,
  });
}
