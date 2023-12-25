import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./index.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskRepository extends Repository<Task> {
    constructor(
        @InjectRepository(Task)
        private task: Repository<Task>,
        private dataSource: DataSource
    ) {
        super(Task, dataSource.createEntityManager());
    }


    async getAllTasks() {
        const taskRepository = this.dataSource.getRepository(Task);
        const tasks = await taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.status', 'status')
            .select(["task.*", "status.name AS statusName", "status.color AS statusColor"])
            .where({ isActive: true })
            .orderBy('task.createdDate', 'DESC')
            .getRawMany();

        return tasks;
    }
}