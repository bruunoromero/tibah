import { injectable } from "tsyringe";
import { v4 } from "uuid";
import { CreateTask, Task } from "~/models/task.model";
import { TaskRepository } from "../repositories/task.repository";

@injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async create(
    { title, description }: CreateTask,
    userId: string
  ): Promise<Task> {
    return this.taskRepository.put({
      key: v4(),
      title,
      description,
      userId,
    });
  }

  async allByUser(userId: string): Promise<Task[]> {
    const { items } = await this.taskRepository.fetch({
      userId: { $eq: userId },
    });

    return items;
  }
}
