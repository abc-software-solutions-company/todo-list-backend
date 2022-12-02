import { TestingModule } from '@nestjs/testing';
import { testHelper } from 'src/utils/testHelper';
import { UserService } from './index.service';

describe('UsersService', () => {
  let usersService: UserService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await testHelper();
    usersService = moduleRef.get<UserService>(UserService);
  });
  afterEach(async () => {
    await moduleRef.close();
  });
  describe('create()', () => {
    it(`Shound return 400 Status Code if User Don't type name`, async () => {
      let response;
      try {
        response = await usersService.create({ name: '', email: null });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toEqual(400);
    });

    it(`Shound return name only if user login by name`, async () => {
      const name = 'Thien';
      const email = null;
      const response = await usersService.create({ name, email });
      expect(response.email).toEqual(email);
      expect(response.name).toEqual(name);
    });

    it(`Shound return name and email if user login by gmail`, async () => {
      const name = 'Thien';
      const email = 'lamminhthien@gmail.com';
      const response = await usersService.create({ name, email });
      expect(response.email).toEqual(email);
      expect(response.name).toEqual(name);
    });

    it(`Shound return 400 Status Code If user enter space character only`, async () => {
      const name = '    ';
      const email = 'lamminhthien@gmail.com';
      let response;
      try {
        response = await usersService.create({ name, email });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toEqual(400);
    });

    it(`Shound return 400 Status Code If user enter more than 32 characters`, async () => {
      const name =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const email = 'lamminhthien@gmail.com';
      let response;
      try {
        response = await usersService.create({ name, email });
      } catch (err) {
        response = err.response;
      }
      expect(response.statusCode).toEqual(400);
    });
  });
});
