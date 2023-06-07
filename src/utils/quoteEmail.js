import _ from "lodash";
import ReactionError from "@reactioncommerce/reaction-error";

export async function sendGeneratedQuoteEmail(
  context,
  generatedQuote,
  addedVehicle,
  { bodyTemplate = "accounts/generatedQuoteEmail", temp }
) {
  //{ bodyTemplate = "coreDefault", userId }
  //console.log("User ID", userId);

  const {
    collections: { Accounts, Shops, users },
  } = context;

  console.log("In quote email function");

  const shop = await Shops.findOne({ shopType: "primary" });
  if (!shop) throw new ReactionError("not-found", "Shop not found");

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
    // confirmationUrl: REACTION_IDENTITY_PUBLIC_VERIFY_EMAIL_URL.replace("TOKEN", token),
    // confirmationUrl: otp,
    userEmailAddress: "awahab1116@gmail.com",
  };
  const language = shop.language;

  return context.mutations.sendEmail(context, {
    data: dataForEmail,
    fromShop: shop,
    templateName: bodyTemplate,
    language,
    to: "awahab1116@gmail.com",
  });
}
