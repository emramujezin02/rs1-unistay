import { MyAuthService } from './my-auth.service';

describe('MyAuthService remembered users', () => {
  let service: MyAuthService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    service = new MyAuthService({} as any);
  });

  it('removes legacy plaintext passwords from rememberedUsers', () => {
    localStorage.setItem('rememberedUsers', JSON.stringify([
      { email: 'student@test.com', password: 'Secret123!' },
      { email: 'admin@test.com', password: 'Admin123!' }
    ]));

    const remembered = service.getRememberedUsers();
    const stored = localStorage.getItem('rememberedUsers') ?? '';

    expect(remembered).toEqual([
      { email: 'student@test.com' },
      { email: 'admin@test.com' }
    ]);
    expect(stored).toContain('student@test.com');
    expect(stored).not.toContain('Secret123!');
    expect(stored).not.toContain('password');
  });

  it('stores only email when remembering a user', () => {
    service.rememberEmail('student@test.com');

    expect(localStorage.getItem('rememberedUsers')).toBe(JSON.stringify([
      { email: 'student@test.com' }
    ]));
    expect(sessionStorage.length).toBe(0);
  });
});
