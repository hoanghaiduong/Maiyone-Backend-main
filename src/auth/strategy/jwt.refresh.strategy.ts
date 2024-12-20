import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {  Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import {AuthService} from "../auth.service";
import { ErrorMessages } from "src/common/exceptions/error.code";
import { ApiException } from "src/common/exceptions/api.exception";
import { jwtConstants } from "../constants";
import { IJwtPayload } from "src/common/interfaces";


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	"refresh",
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: jwtConstants._access_secret,
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: IJwtPayload): Promise<IJwtPayload> {
		console.log("JwtRefreshStrategy.validate", payload);
		try {
			await this.jwtService.verify(
				request.headers["authorization"].split(" ")[1],
				{
					ignoreExpiration: true,
				},
			);
		} catch (e) {
			switch (e.name) {
				case "TokenExpiredError":
					throw new ApiException(ErrorMessages.TOKEN_EXPIRED);
				case "JsonWebTokenError":
					throw new ApiException(ErrorMessages.INVALID_TOKEN);
				default:
					throw new ApiException(ErrorMessages.INVALID_TOKEN);
			}
		}
		await this.authService.validateUserRefreshToken(payload.id, request.body.refreshToken);
		return await this.authService.validateJwt(payload);
	}
}
