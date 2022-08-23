import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentTodoList = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentTodoList;
  }
);
