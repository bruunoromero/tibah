import { container } from "tsyringe";
import { detaFactory, DETA_TOKEN } from "./deta.register";

export const initRegistry = () => {
  container.register(DETA_TOKEN, { useFactory: detaFactory });
};
