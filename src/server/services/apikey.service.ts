import { v4 as uuid } from "uuid";
import { injectable } from "tsyringe";
import { uid } from "rand-token";
import { Apikey } from "~/models/apikey.model";
import { ApikeyRepository } from "../repositories/apikey.repository";

@injectable()
export class ApikeyService {
  constructor(private apikeyRepository: ApikeyRepository) {}

  async create(userId: string): Promise<Apikey> {
    await this.apikeyRepository.ensureUnique({ userId: { $eq: userId } });

    return this.apikeyRepository.put({
      key: uuid(),
      token: uid(128),
      userId,
    });
  }

  async maybeGetByUser(userId: string): Promise<Apikey | null> {
    return this.apikeyRepository.fetchMaybeOne({ userId: { $eq: userId } });
  }

  async maybeGetByToken(token: string): Promise<Apikey | null> {
    return this.apikeyRepository.fetchMaybeOne({ token: { $eq: token } });
  }
}
