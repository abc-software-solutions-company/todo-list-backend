import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { AuthService } from './index.service';

describe('AUthService', () => {
  let authService: AuthService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    authService = moduleRef.get<AuthService>(AuthService);
    console.log("123")
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Auth Service Test when by name not email', () => {
    it('Should return access token when user login by name', async () => {
      const email = undefined;
      const name = 'Linh';
      const response = await authService.login({ email, name });
      expect(response.accessToken).not.toBeNull();
      expect(response.accessToken).not.toBeUndefined();
      expect(response.accessToken.length).toEqual(200);
    });

    it('Should return 400 error when user enter name bank', async () => {
      const email = undefined;
      const name = undefined;
      let response;
      try {
        response = await authService.login({ email, name });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('Should return 400 error when user enter name space', async () => {
      const email = undefined;
      const name = '     ';
      let response;
      try {
        response = await authService.login({ email, name });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Auth Service Test when login by email', () => {
    it('Should return access token when user login by email', async () => {
      const email = 'a000006@abcsoftwarecompany.com';
      const name = 'Linh Pham';
      const response = await authService.login({email, name });
      expect(response.accessToken.length).toBeGreaterThanOrEqual(243);
    });

    it('Should return  when user donot type email', async () => {
      const email = undefined;
      const name = undefined;
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
