// Testing Module là thư viện chạy jests cho unit test
import { TestingModule } from '@nestjs/testing';
// Test Helper là bộ kit để vừa kết nối database vừa load tất cả các module test
import { testHelper } from 'src/utils/testHelper';
// Gắn Cái Service mà ta cần test (Lưu ý trong 1 service có rất nhiều hàm chức năng khác nhau)
import { TodolistService } from './index.service';

// Mô tả tên test
describe('TodolistService', () => {
  // Khởi tạo đối tượng con để sử dụng các hàm bên trong service (Lập trình hướng đối tượng)
  let todolistService: TodolistService;
  // Khởi tạo module testting để đọc các kết nối trong test Helper
  let moduleRef: TestingModule;

  // Trước khi test ta cần set up....
  beforeEach(async () => {
    moduleRef = await testHelper();
    todolistService = moduleRef.get<TodolistService>(TodolistService);
  });
  // Sau khi test ta đóng cửa module test
  afterEach(async () => {
    await moduleRef.close();
  });

  const userId = 'ae1e1ec3-ed48-4e9d-83db-9be98aea1ea0';

  describe('Todolist Service', () => {
    it('Should return list and verify that list is own by this userId', async () => {
      const name = 'Thien';
      const response = await todolistService.create({ name, userId });
      expect(response.name).toEqual(name);
      expect(response.userId).toEqual(userId);
    });

    it('Should return  errorr when list name not type', async () => {
      const name = undefined;
      let response;
      try {
        response = await todolistService.create({ name, userId });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('Should return  errorr when list name when type space character only', async () => {
      const name = '     ';
      let response;
      try {
        response = await todolistService.create({ name, userId });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
});
