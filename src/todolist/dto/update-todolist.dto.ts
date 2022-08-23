import { PartialType } from "@nestjs/swagger";
import { CreateTodolistDto } from "./create-todolist.dto";

export class UpdateTodolistDto extends PartialType(CreateTodolistDto) {}
