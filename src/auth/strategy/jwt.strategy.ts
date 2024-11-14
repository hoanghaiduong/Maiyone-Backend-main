import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { User } from '../../common/entities/user.entity';
import { jwtConstants } from '../constants';
import { IJwtPayload } from 'src/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey:jwtConstants._access_secret,
		});
	}

	async validate(payload: IJwtPayload): Promise<User> {
		return await this.authService.validateJwt(payload);
	}

}
