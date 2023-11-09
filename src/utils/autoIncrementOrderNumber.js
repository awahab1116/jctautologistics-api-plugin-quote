export default async function getNextOrderNumber(context) {
  const { collections } = context;
  const { OrderNumber } = collections;
  console.log("In function increment");
  const orderNumberDoc = await OrderNumber.findOneAndUpdate(
    {},
    { $inc: { lastOrderNumber: 1 } },
    { new: true }
  );

  console.log("Autoincrement is ", orderNumberDoc);

  return orderNumberDoc.ok ? orderNumberDoc?.value?.lastOrderNumber + 1 : 0;
}
