// Testing Module là thư viện chạy jests cho unit test
import { TestingModule } from '@nestjs/testing';
// Test Helper là bộ kit để vừa kết nối database vừa load tất cả các module test
import { testHelper } from 'src/utils/testHelper';
// Gắn Cái Service mà ta cần test (Lưu ý trong 1 service có rất nhiều hàm chức năng khác nhau)
import { AuthService } from './index.service';

// Mô tả tên test
describe('AuthService', () => {
  // Khởi tạo đối tượng con để sử dụng các hàm bên trong service (Lập trình hướng đối tượng)
  let authService: AuthService;
  // Khởi tạo module testting để đọc các kết nối trong test Helper
  let moduleRef: TestingModule;

  // Trước khi test ta cần set up....
  beforeEach(async () => {
    moduleRef = await testHelper();
    authService = moduleRef.get<AuthService>(AuthService);
  });
  // Sau khi test ta đóng cửa module test
  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Auth Service Test when not use email', () => {
    /* A test case. */

    it('Should return access token when user don"t use login email', async () => {
      const email = null;
      const name = 'thien';
      const response = await authService.login({ email, name });
      expect(response.accessToken).not.toBeNull();
      expect(response.accessToken).not.toBeUndefined();
      expect(response.accessToken.length).toEqual(201);
    });

    it('Should return 400 error when user don"t type name', async () => {
      const name = null;
      const email = null;
      let response;
      try {
        response = await authService.login({ email, name });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Auth Service Test when use email', () => {
    /* A test case. */

    it('Should return access token when user login by email correct', async () => {
      const email = 'a000009@abcsoftwarecompany.com';
      const name = null;
      const response = await authService.login({ email, name });
      expect(response.user.email).toEqual(email);
    });

    it('Should return error when email is not registered', async () => {
      const email = 'b@';
      const name = null;
      let response;
      try {
        response = await authService.login({ email, name });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
});
