import { User } from '../entities/User.entity';

export interface AuthenticationRequest extends Request {
  user: User;
}
