import { auth } from './lib/auth';
import { UserRepository } from '../../packages/repositories/user-repo'
import { AuthService } from '../../packages/services/auth-service'

// Repos
const userRepository = new UserRepository;

// Services
const authService = new AuthService(auth, userRepository);

export { authService }