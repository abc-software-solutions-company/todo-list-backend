import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { CreateTaskDto, ReorderTaskDto } from './task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  indexStep :number = Math.pow(2, 30);
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
    const index = ((await this.repo.countBy({ todoListId: taskDto.todoListId })) + 1) * this.indexStep;
    const task = this.repo.create({ ...taskDto, id: taskId, index });
    return this.repo.save(task);
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

  async resetOrder(todoListId: string) {
    const tasks = await this.repo.find({where:{todoListId: todoListId},order:{index:'ASC'}});
    tasks.forEach(async (task,index) => {
      task.index=(index+1)*this.indexStep;
      console.log(task)
      await this.repo.save(task)
    });
    
  }

  async reorderTask({taskFirstID,taskReorderID,taskSecondID}: ReorderTaskDto) {
    const task = await this.repo.findOneBy({id:taskReorderID})
    const index1 = Number(taskFirstID ? (await this.repo.findOneBy({id:taskFirstID})).index: 0);
    const index2 = Number(taskSecondID ? (await this.repo.findOneBy({id:taskSecondID})).index : index1+this.indexStep);

    const index = Math.round((index1 + index2) / 2);
    task.index = index;
    console.log(index1,index,index2);
    await this.repo.save(task)

    if (index-index1<32 || index2-index<32) {
      this.resetOrder(task.todoListId)
    }
    console.log(index1,index,index2)
    return task;
  }
}
