import {
  Controller,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Req,
  NotAcceptableException,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import extractHeader from 'src/utils/extract-header';
import { IRequest } from 'src/utils/type';
import { CreateTaskDto, ReorderTaskDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:listID')
  async readTodoListByID(@Param('listID') listID: string) {
    try {
      return this.taskService.findTaskFromListByID(listID);
    } catch {
      throw new NotFoundException('😓😓Cannot find task from this list');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/single/:id')
  async getTaskById(@Param('id') id: string) {
    return this.taskService.findTaskById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(@Body() body: CreateTaskDto, @Req() request: IRequest) {
    const { userId } = request.user;
    if (body.name.trim().length == 0) {
      throw new NotAcceptableException('Name not empty');
    }
    body.userId = userId;
    return this.taskService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    try {
      const taskExisting = await this.taskService.findTaskById(id);
      return this.taskService.remove(taskExisting);
    } catch {
      throw new NotFoundException('Cannot remove task because task not found 😢');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async markTaskDone(@Param('id') id: string) {
    try {
      const taskExisting = await this.taskService.findTaskById(id);
      if (!taskExisting) throw new NotFoundException('Cannot mark done this task because task not found 😢😭😭😭😭😭');
      return this.taskService.markTaskDone(taskExisting);
    } catch {
      throw new NotFoundException('Cannot mark done this task because task not found ');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    if (updateTaskDto.name.trim().length == 0) throw new NotAcceptableException('Name not empty');
    else
      try {
        const taskExisting = await this.taskService.findTaskById(id);
        return this.taskService.updateTask(taskExisting, updateTaskDto.name);
      } catch {
        throw new NotFoundException('Cannot update task because task not found 😢');
      }
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('/query/reorders')
  async reorderTask(@Body() body: ReorderTaskDto) {

    return await this.taskService.reorderTask(body);
    // return [body.taskFirstID, body.taskSecondID]
  }
}
