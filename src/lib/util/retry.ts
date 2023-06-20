interface Func<T> {
	([...args]: any, args2?: any): T;
}

export default function retry<T>(fn: Func<T>, timeout: number, maxRetry: number) {
	return new Promise<T>((resolve, reject) => {
		retrier(fn, timeout, maxRetry, 0);

		async function retrier(fn: Function, timeout: number, maxRetry: number, count: number) {
			try {
				resolve(await fn());
			} catch (e) {
				if (count >= maxRetry) {
					reject(e);
				} else {
					count = count + 1;
					setTimeout(() => retrier(fn, timeout, maxRetry, count), timeout);
				}
			}
		}
	});
}
