// import { TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';

// describe('UsersService', () => {
//   let usersService: UsersService;
//   let moduleRef: TestingModule;

//   beforeEach(async () => {
//     moduleRef = await testHelper();
//     usersService = moduleRef.get<UsersService>(UsersService);
//   });
//   afterEach(async () => {
//     await moduleRef.close();
//   });
//   describe('create()', () => {
//     it('Should return the name Huy and id 36 letters', async () => {
//       const u = await usersService.create('Huy');
//       expect(u.id.length).toEqual(36);
//       expect(u.name).toEqual('Huy');
//     });
//   });
// });
