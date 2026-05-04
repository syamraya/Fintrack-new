import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

// Tidak perlu import describe, it, beforeEach dari mana pun
describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});