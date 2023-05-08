export default function workerToPromise<returnType>(worker: Worker, message: any): Promise<returnType> {
    return new Promise((resolve, reject) => {
        worker.postMessage(message);
        worker.onmessage = (e) => {
            resolve(e.data as returnType);
        }
        worker.onerror = (e) => {
            reject();
        }
    })
}