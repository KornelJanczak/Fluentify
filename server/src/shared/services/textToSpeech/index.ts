import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import config from "@root/config";
import dotenv from "dotenv";

dotenv.config();

const client = new TextToSpeechClient();

export default client;
