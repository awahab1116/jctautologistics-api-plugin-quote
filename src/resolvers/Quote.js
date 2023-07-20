import { encodeProductOpaqueId } from "../xforms/id.js";
import getVehicleInfo from "../utils/getVehicleInfo.js";

export default {
  _id: (node) => encodeProductOpaqueId(node._id),
  vehicleInfo: (node, args, context, info) => {
    console.log("args are ", args);
    console.log("node arer ", node);
    return getVehicleInfo(context, node._id, node.vehicleId, true, args);
  },
};
