import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, CacheManagerOptions } from '@nestjs/cache-manager';
import { ICacheManageConfig } from '.';

export interface ICacheManager {
  store?: any;
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: T, options?: CacheManagerOptions): Promise<T>;
  del(key: string): Promise<void>;
}

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: ICacheManager,
    @Inject('CACHE_CONFIG') private readonly config: ICacheManageConfig,
  ) {}

  get<T>(key: string): Promise<T> {
    return this.cache.get(`${this.config.namespace}:${key}`);
  }

  set<T>(key: string, value: T, options?: CacheManagerOptions): Promise<T> {
    return this.cache.set(`${this.config.namespace}:${key}`, value, options);
  }

  del(key: string): Promise<void> {
    return this.cache.del(`${this.config.namespace}:${key}`);
  }
}
