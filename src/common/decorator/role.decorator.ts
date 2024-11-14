import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/auth/guard/role-auth.guard";


export const Roles = (...role: string[]) => {
	return applyDecorators(SetMetadata("roles", role), UseGuards(RolesGuard));
};
