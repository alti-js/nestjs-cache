export class CacheManagerMock {
  cache = {};
  get(index) {
    return this.cache[index];
  }
  set(index, val) {
    this.cache[index] = val;
  }
  del(index) {
    delete this.cache[index];
  }
}
