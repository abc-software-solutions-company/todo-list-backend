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
    it('Shound return the name Linh and email ', async () => {
      const name = 'Linh';
      const email = 'null';

      const u = await usersService.create({ name, email});

      expect(u.name).toEqual(name);
      expect(u.email).toEqual(email);
    });
  });
});
