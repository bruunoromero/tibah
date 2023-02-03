import { injectable } from "tsyringe";
import { habit } from "~/models/habit.model";
import { repository } from "./core";

@injectable()
export class HabitRepository extends repository("habits", habit) {}
