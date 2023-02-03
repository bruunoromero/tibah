import { injectable } from "tsyringe";
import { apikey } from "~/models/apikey.model";
import { repository } from "./core";

@injectable()
export class ApikeyRepository extends repository("apikeys", apikey) {}
