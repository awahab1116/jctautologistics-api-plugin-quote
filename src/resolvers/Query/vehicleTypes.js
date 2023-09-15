export default async function vehicleTypes(_, args, context, info) {
  let data = await context.queries.vehicleTypes(context, {});

  console.log("before return");

  return data;
}
