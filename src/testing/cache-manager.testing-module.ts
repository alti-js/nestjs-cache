import { Test, TestingModule } from '@nestjs/testing';
import { CacheManagerService, ICacheManageConfig } from '..';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheManagerMock } from './mocks/cache-manager.mock';

export class CacheManagerTestingModule {
  static async forInternalTest(): Promise<TestingModule> {
    const cacheConfig: ICacheManageConfig = {
      adapter: 'redis',
      adapterOptions: {
        db: 1,
        host: 'localhost',
        port: '1111',
        password: 'test',
      },
      namespace: 'test-ns',
    };
    return await Test.createTestingModule({
      providers: [
        CacheManagerService,
        { provide: CACHE_MANAGER, useClass: CacheManagerMock },
        { provide: 'CACHE_CONFIG', useValue: cacheConfig },
      ],
    }).compile();
  }
}
