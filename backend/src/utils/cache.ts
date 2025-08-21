export class GlobalCache<T> {
	private cache = new Map<string, { data: T; expiry: number }>();
	private ttl: number;

	constructor(ttl: number) {
		this.ttl = ttl;
	}

	get(key: string): T | null {
		const entry = this.cache.get(key);
		if (!entry) return null;
		if (Date.now() > entry.expiry) {
			this.cache.delete(key);
			return null;
		}
		return entry.data;
	}

	set(key: string, data: T) {
		const expiry = Date.now() + this.ttl;
		this.cache.set(key, { data, expiry });
	}

	delete(key: string) {
		this.cache.delete(key);
	}

	keys() {
		return Array.from(this.cache.keys());
	}

	clearByPrefix(prefix?: string) {
		if (!prefix) {
			this.cache.clear();
			return;
		}

		for (const key of this.cache.keys()) {
			if (key.startsWith(prefix)) {
				this.cache.delete(key);
			}
		}
	}

	clearByFilter(filterFn: (key: string) => boolean) {
		for (const key of this.cache.keys()) {
			if (filterFn(key)) {
				this.cache.delete(key);
			}
		}
	}
}
