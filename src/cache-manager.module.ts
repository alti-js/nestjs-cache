import { DynamicModule, Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheManagerService } from './cache-manager.service';
import { ICacheManageConfig } from './dtos/config.dto';
import * as redisStore from 'cache-manager-redis-yet';

@Global()
@Module({})
export class CacheManagerModule {
  static forRoot(config: ICacheManageConfig): DynamicModule {
    let store;
    if (config.adapter === 'redis') {
      store = redisStore;
    }
    const cacheModule = store
      ? NestCacheModule.register({
          store,
          db: config.adapterOptions?.db || 0,
          host: config.adapterOptions?.host || 'localhost',
          port: config.adapterOptions?.port || 6379,
          auth_pass: config.adapterOptions?.password || undefined,
          ttl: config.ttl || 180, // seconds
          max: config.max || 1000, // maximum number of items in cache
        })
      : NestCacheModule.register();
    return {
      global: true,
      module: CacheManagerModule,
      imports: [cacheModule],
      providers: [
        {
          provide: 'CACHE_CONFIG',
          useValue: config,
        },
        CacheManagerService,
      ],
      exports: [CacheManagerService, cacheModule],
    };
  }
}
