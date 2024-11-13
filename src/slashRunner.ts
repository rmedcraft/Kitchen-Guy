import * as dotenv from "dotenv";
dotenv.config();
import { slashRegister } from "./slashRegistry";

const medlandID = process.env.medland;
const mouseID = process.env.mouse;

slashRegister(medlandID);
slashRegister(mouseID);