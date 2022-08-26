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

  async findTaskByName(taskName: string) {
    const firstTask = await this.repo
      .createQueryBuilder('task')
      .where('task.taskName = :taskName', {taskName: taskName})
      .getOne();
    return firstTask;
  }

  async create(taskDto: CreateTaskDto, todolist: Todolist, user: User) {
    const task = this.repo.create(taskDto);
    task.user = user;
    task.todolist = todolist;
    return this.repo.save(task);
  }

  async findTaskFromListByID(listId: number) {
    const TaskList = await this.repo
      .createQueryBuilder('task')
      .where('task.todolistId = :listId', {listId: listId})
      .getMany();
    return TaskList;
  }

  async remove(task: Task) {
    return this.repo.remove(task);
  }

  async updateTask(task: Task, taskName: string) {
    task.taskName = taskName;
    return this.repo.save(task);
  }

  async markTaskDone(task: Task) {
    task.isDone = true;
    return this.repo.save(task);
  }
}
