import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { CreateTaskDto } from './task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

  async validTaskId(id: string) {
    const taskIdExisted = await this.repo.countBy({ id: id });
    if (taskIdExisted >= 1) return false;
    return true;
  }

  async findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  async findTaskById(id: string) {
    try {
      const task = await this.repo.findOneBy({ id });
      return task;
    } catch {
      throw new NotFoundException('😓 Cannot find this task ');
    }
  }

  async findTaskByName(name: string) {
    const firstTask = await this.repo.createQueryBuilder('task').where('task.name = :name', { name: name }).getOne();
    return firstTask;
  }

  async create(taskDto: CreateTaskDto) {
    let taskId = uuid();

    while ((await this.validTaskId(taskId)) == false) taskId = uuid();

    if (taskDto.name.trim().length !== 0) {
      const task = this.repo.create(taskDto);
      task.id = taskId;
      task.index = await this.setIndexForNewTask();
      return this.repo.save(task);
    } else throw new NotAcceptableException('Task name must at least 1 character');
  }

  async findTaskFromListByID(todoListId: string) {
    const TaskList = await this.repo
      .createQueryBuilder('task')
      .where('task.todoListId = :todoListId', { todoListId: todoListId })
      .andWhere('task.isActive = true')
      .orderBy('task.index', 'ASC')
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
    const taskHaveZeroIndex = await this.repo.findBy({ index: 0 });
    // now use a loop to assign index increment
    for (let index = 0; index < taskHaveZeroIndex.length - 1; index++) {
      // Change index for each task
      taskHaveZeroIndex[index].index = taskHaveZeroIndex[index].index + 1000 * index;
      await this.repo.save(taskHaveZeroIndex[index]);
    }
    return '😍😍😍😍😍';
  }

  async countAllTask() {
    const countAllTask = await this.repo.count();
    return countAllTask;
  }

  async setIndexForNewTask() {
    const newIndex = await this.countAllTask();
    return newIndex * 1000;
  }

  async reorderTask(taskFirst: Task, taskSecond: Task, taskNeedReorder: Task) {
    const firstIndex = taskFirst.index;
    const secondIndex = taskSecond.index;
    let reorderIndex = taskNeedReorder.index;

    reorderIndex = (firstIndex + secondIndex) / 2;

    taskNeedReorder.index = reorderIndex;
    return this.repo.save(taskNeedReorder);
  }

  async reorderTaskToTop(taskNeedReorder: Task, taskSecond: Task) {
    let reorderIndex = taskNeedReorder.index;
    const secondIndex = taskSecond.index;

    reorderIndex = secondIndex - 1;

    taskNeedReorder.index = reorderIndex;
    return this.repo.save(taskNeedReorder);
  }

  async reorderTaskToBottom(taskNeedReorder: Task, taskFirst: Task) {
    let reorderIndex = taskNeedReorder.index;
    const fistIndex = taskFirst.index;

    reorderIndex = fistIndex + 1;

    taskNeedReorder.index = reorderIndex;
    return this.repo.save(taskNeedReorder);
  }
}
