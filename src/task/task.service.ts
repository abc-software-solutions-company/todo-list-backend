import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './entities/task.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {Todolist} from 'src/todolist/entities/todolist.entity';
import { uuid } from 'uuidv4';
@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  async validTaskId(id: string) {
    // Check if userId existed
    const taskIdExisted = await this.repo.count({id:id});
    if (taskIdExisted >= 1) return false
    return true
  }

  async findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  async findTaskById(id: string) {
    try {
      const task = await this.repo.findOne(id);
      return task;
    } catch {throw new NotFoundException('😓 Cannot find this task ');}
  }

  async findTaskByName(name: string) {
    const firstTask = await this.repo.createQueryBuilder('task').where('task.name = :name', {name: name}).getOne();
    return firstTask;
  }

  async create(taskDto: CreateTaskDto, todolist: Todolist) {
    let taskId = uuid();

    while (await this.validTaskId(taskId)==false) taskId = uuid();

    if (taskDto.name.trim().length !== 0) {
      const task = this.repo.create(taskDto);
      task.id = taskId
      task.index = await this.setIndexForNewTask();
      return this.repo.save(task);
    } else throw new NotAcceptableException('Task name must at least 1 character');
  }

  async findTaskFromListByID(todoListId: string) {
    const TaskList = await this.repo
      .createQueryBuilder('task')
      .where('task.todoListId = :todoListId', {todoListId: todoListId})
      .andWhere('task.isActive = true')
      .orderBy('task.createdDate', 'DESC')
      .getMany();
    return TaskList;
  }

  async remove(task: Task) {
    task.isActive = false;
    return this.repo.save(task);
  }

  async updateTask(task: Task, name: string) {
    if (task.name.trim().length !== 0) {
      task.name = name;
      return this.repo.save(task);
    } else throw new NotAcceptableException('Task name must at least 1 character');
  }

  async markTaskDone(task: Task) {
    task.isDone = !task.isDone;
    return this.repo.save(task);
  }

  async setIndexForAllTask() {
    // if any task have default index = 1, assign it to number + 100
    const taskHaveZeroIndex = await this.repo.find({index:0})
    // now use a loop to assign index increment
    for (let index = 0; index < taskHaveZeroIndex.length - 1; index++) {
      // Change index for each task
      taskHaveZeroIndex[index].index = taskHaveZeroIndex[index].index + 1000*index;
      await this.repo.save(taskHaveZeroIndex[index])
    }
    return "😍😍😍😍😍"
  }

  async countAllTask() {
    const countAllTask = await this.repo.count();
    return countAllTask;
  }

  async setIndexForNewTask() {
    const newIndex = await this.countAllTask()
    return newIndex*1000;
  }

  async setTaskStatus(task: Task, status: number) {
    task.status = status;
    return this.repo.save(task);
  }

  async reorderTask(taskFirst: Task, taskSecond: Task) {
    const taskFirstIndex = taskFirst.index;
    const taskSecondIndex = taskSecond.index;
    return [taskFirstIndex, taskSecondIndex]
  }
}
