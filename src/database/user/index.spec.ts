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
    it('Shound return the name Huy and id 36 letters', async () => {
      const u = await usersService.create({ name: 'Huy', email: null });
      expect(u.id.length).toEqual(36);
      expect(u.name).toEqual('Huy');
    });
  });
});
