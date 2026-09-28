import { SetMetadata } from '@nestjs/common';
export const REQUIRE_ROLES_KEY = 'luvien:require-roles';
export const RequireRoles = (...roles) => SetMetadata(REQUIRE_ROLES_KEY, roles);
//# sourceMappingURL=require-roles.decorator.js.map