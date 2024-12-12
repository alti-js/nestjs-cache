export interface IRedisConfigOptions {
  host: string;
  port: string;
  password?: string;
  db: number;
}

export interface ICacheManageConfig {
  adapter: 'redis';
  namespace: string;
  adapterOptions: IRedisConfigOptions;
  ttl?: number;
  max?: number;
}
