import { jwtAuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new jwtAuthGuard()).toBeDefined();
  });
});
