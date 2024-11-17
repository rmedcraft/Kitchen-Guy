import * as dotenv from "dotenv";
dotenv.config();
import { slashRegister } from "./slashRegistry";

const medlandID = process.env.MEDLAND;
const mouseID = process.env.MOUSE;
const minecraftID = process.env.MINECRAFT;

slashRegister(medlandID);
slashRegister(mouseID);
slashRegister(minecraftID);


console.log("Registered Commands!");