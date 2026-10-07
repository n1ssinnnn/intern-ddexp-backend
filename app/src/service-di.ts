import { auth } from '../../packages/auth';
import { UserRepository } from '../../packages/repositories/user-repo'
import { AuthService } from '../../packages/services/auth-service'
import { UserService } from '../../packages/services/user-service'

// Repos
const userRepository = new UserRepository;

// Services
const authService = new AuthService(auth, userRepository);
const userService = new UserService(userRepository);

export { authService, userService }