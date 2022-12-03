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
    it('Shound return the name Huy and email ', async () => {
      const name = 'Thien';
      const email = 'null';

      const u = await usersService.create({ name, email });

      expect(u.name).toEqual(name);
      expect(u.email).toEqual(email);
    });

    it(`Shound return 400 BadRequest when user don't enter name `, async () => {
      const name = '';
      const email = 'null';

      const u = await usersService.create({ name, email });
    });
  });
});
