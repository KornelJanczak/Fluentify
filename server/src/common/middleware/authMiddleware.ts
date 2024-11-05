import { jwtVerify } from "@kinde-oss/kinde-node-express";

const jwtVerifer = jwtVerify(process.env.KINDE_ISSUER_URL || "", {
  audience: "",
});

export default jwtVerifer;
