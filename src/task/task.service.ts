import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './entities/task.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task-dto';
import {Todolist} from 'src/todolist/entities/todolist.entity';
import {User} from 'src/users/entities/user.entity';
@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  async findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  async findTaskById(id: string) {
    const task = await this.repo.findOne(id);
    return task;
  }

  async findTaskByName(name: string) {
    const firstTask = await this.repo
      .createQueryBuilder('task')
      .where('task.name = :name', {name: name})
      .getOne();
    return firstTask;
  }

  async create(taskDto: CreateTaskDto, todolist: Todolist) {
    const task = this.repo.create(taskDto);
    return this.repo.save(task);
  }

  async findTaskFromListByID(todoListId: string) {
    const TaskList = await this.repo
      .createQueryBuilder('task')
      .where('task.todoListId = :todoListId', {todoListId: todoListId})
      .andWhere('task.isActive = true')
      .orderBy('task.createdDate','DESC')
      .getMany();
    return TaskList;
  }

  async remove(task: Task) {
    task.isActive = false;
    return this.repo.save(task);
  }

  async updateTask(task: Task, name: string) {
    task.name = name;
    return this.repo.save(task);
  }

  async markTaskDone(task: Task) {
    task.isDone = !(task.isDone);
    return this.repo.save(task);
  }
}
