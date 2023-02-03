import { v4 as uuid } from "uuid";
import { injectable } from "tsyringe";
import { CreateHabit, Habit } from "~/models/habit.model";
import { HabitRepository } from "../repositories/habit.repository";

@injectable()
export class HabitService {
  constructor(private habitRepository: HabitRepository) {}

  async create({ name }: CreateHabit, userId: string): Promise<Habit> {
    await this.habitRepository.ensureUnique({
      userId: { $eq: userId },
      name: { $eq: name },
    });

    return this.habitRepository.put({
      key: uuid(),
      userId,
      name,
    });
  }

  async all(): Promise<Habit[]> {
    const { items } = await this.habitRepository.fetch();

    return items;
  }
}
