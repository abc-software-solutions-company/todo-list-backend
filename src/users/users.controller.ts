import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user-dto";
import { UserDto } from "./dtos/user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { User } from "./entities/user.entity";

@ApiTags("User")
@Controller("user")
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get("/get-all")
  getAllUser(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post("/create")
  async createUser(@Body() body: CreateUserDto) {
    const existUser = await this.usersService
      .findUserByName(body.user_name)
      .then((result) => {
        return result;
      });

    if (existUser !== undefined) {
      throw new BadRequestException("This user already existing");
    }
    this.usersService.create(body.user_name);
  }
}
