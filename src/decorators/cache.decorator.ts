import { InternalServerErrorException } from '@nestjs/common';
import { CacheManagerOptions } from '@nestjs/cache-manager';
import 'reflect-metadata';
import { tap, switchMap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { CacheManagerService } from '../cache-manager.service';

type Cacheable<T> = (...args: any[]) => Observable<T>;
export interface ICacheableClass {
  cacheService: CacheManagerService;
}

export function Cache<T>(options?: CacheManagerOptions) {
  return (
    target: any,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Cacheable<T>>,
  ): TypedPropertyDescriptor<Cacheable<T>> => {
    const originalMethod: Cacheable<T> = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = function (...args: any[]) {
      const cache = (this as ICacheableClass).cacheService;
      if (!cache || !(cache instanceof CacheManagerService)) {
        throw new InternalServerErrorException('Target Class should inject CacheService');
      } else {
        const cacheKey = `${className}:${methodName}:${args.map((a) => JSON.stringify(a)).join()}`;

        return from(cache.get<T>(cacheKey)).pipe(
          switchMap((res) =>
            res
              ? of(res)
              : originalMethod
                  .apply(this, args)
                  .pipe(tap((methodResult: T) => cache.set<T>(cacheKey, methodResult, options))),
          ),
        ) as Observable<T>;
      }
    };

    return descriptor;
  };
}

export function CacheBuster<T>(cacheKey: string) {
  return (target: any, methodName: string, descriptor: TypedPropertyDescriptor<Cacheable<T>>) => {
    const originalMethod: Cacheable<T> = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return originalMethod
        .apply(this as ICacheableClass, args)
        .pipe(tap(() => (this as ICacheableClass).cacheService.del(cacheKey)));
    };
    return descriptor;
  };
}
