import { injectable } from "tsyringe";
import { task } from "~/models/task.model";
import { repository } from "./core";

@injectable()
export class TaskRepository extends repository("tasks", task) {}
