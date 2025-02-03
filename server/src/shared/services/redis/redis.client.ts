import { createClient } from "redis";
import { config } from "@root/config";

export const client = createClient();
