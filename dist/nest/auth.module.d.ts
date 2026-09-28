import { DynamicModule } from '@nestjs/common';
import type { AuthModuleAsyncOptions, AuthModuleOptions } from './auth.config.js';
export declare class AuthModule {
    static forRoot(options: AuthModuleOptions): DynamicModule;
    static forRootAsync<TArgs extends unknown[]>(asyncOptions: AuthModuleAsyncOptions<TArgs>): DynamicModule;
}
//# sourceMappingURL=auth.module.d.ts.map