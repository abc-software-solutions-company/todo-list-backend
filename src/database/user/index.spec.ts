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
    it('Shound create user with name Linh, no email', async () => {
      const name = 'Linh';
      const email = 'null';

      const u = await usersService.create({ name, email });

      expect(u.name).toEqual(name);
      expect(u.email).toEqual(email);
    });

    it('Shound create user with name Linh, no email and update name', async () => {
      const name = 'Linh';
      const email = 'null';

      const { id } = await usersService.create({ name, email });

      const newName = 'Linh Loli Cute';
      const response = await usersService.update({ id, name: newName });

      expect(response.id).toEqual(id);
      expect(response.name).toEqual(newName);
    });
  });
});
