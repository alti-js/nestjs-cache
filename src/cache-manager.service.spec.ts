import { TestingModule } from '@nestjs/testing';
import { CacheManagerService } from './cache-manager.service';
import { CacheManagerTestingModule } from './testing/cache-manager.testing-module';

describe('CacheManagerService', () => {
  let service: CacheManagerService;

  beforeEach(async () => {
    const module: TestingModule = await CacheManagerTestingModule.forInternalTest();

    service = module.get<CacheManagerService>(CacheManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set', async () => {
    await service.set('test', 'test');
    expect(service.get('test')).toBe('test');
  });

  it('should get', async () => {
    await service.set('test', 'test');
    expect(service.get('test')).toBe('test');
  });

  it('should remove', async () => {
    await service.set('test', 'test');
    await service.del('test');
    expect(service.get('test')).toBeUndefined();
  });
});
