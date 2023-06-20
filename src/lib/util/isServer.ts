export default function isServer() {
	return typeof process === 'object';
}
