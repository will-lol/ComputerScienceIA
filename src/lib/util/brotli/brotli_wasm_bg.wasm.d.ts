//generated using https://github.com/rustwasm/wasm-bindgen
/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function compress(a: number, b: number, c: number, d: number, e: number, f: number): void;
export function decompress(a: number, b: number, c: number, d: number): void;
export function BrotliDecoderCreateInstance(a: number, b: number, c: number): number;
export function BrotliDecoderSetParameter(a: number, b: number, c: number): void;
export function BrotliDecoderDecompress(a: number, b: number, c: number, d: number): number;
export function BrotliDecoderDecompressStream(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number
): number;
export function BrotliDecoderDecompressStreaming(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number
): number;
export function BrotliDecoderDecompressWithReturnInfo(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number
): void;
export function BrotliDecoderDecompressPrealloc(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	g: number,
	h: number,
	i: number,
	j: number,
	k: number
): void;
export function BrotliDecoderMallocU8(a: number, b: number): number;
export function BrotliDecoderFreeU8(a: number, b: number, c: number): void;
export function BrotliDecoderMallocUsize(a: number, b: number): number;
export function BrotliDecoderFreeUsize(a: number, b: number, c: number): void;
export function BrotliDecoderDestroyInstance(a: number): void;
export function BrotliDecoderVersion(): number;
export function CBrotliDecoderErrorString(a: number): number;
export function BrotliDecoderErrorString(a: number): number;
export function CBrotliDecoderHasMoreOutput(a: number): number;
export function BrotliDecoderHasMoreOutput(a: number): number;
export function CBrotliDecoderTakeOutput(a: number, b: number): number;
export function BrotliDecoderTakeOutput(a: number, b: number): number;
export function CBrotliDecoderIsUsed(a: number): number;
export function BrotliDecoderIsUsed(a: number): number;
export function CBrotliDecoderIsFinished(a: number): number;
export function BrotliDecoderIsFinished(a: number): number;
export function CBrotliDecoderGetErrorCode(a: number): number;
export function BrotliDecoderGetErrorCode(a: number): number;
export function CBrotliDecoderGetErrorString(a: number): number;
export function BrotliDecoderGetErrorString(a: number): number;
export function BrotliEncoderCreateInstance(a: number, b: number, c: number): number;
export function BrotliEncoderSetParameter(a: number, b: number, c: number): number;
export function BrotliEncoderDestroyInstance(a: number): void;
export function BrotliEncoderIsFinished(a: number): number;
export function BrotliEncoderHasMoreOutput(a: number): number;
export function BrotliEncoderSetCustomDictionary(a: number, b: number, c: number): void;
export function BrotliEncoderTakeOutput(a: number, b: number): number;
export function BrotliEncoderVersion(): number;
export function BrotliEncoderMaxCompressedSize(a: number): number;
export function BrotliEncoderCompress(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	g: number
): number;
export function BrotliEncoderCompressStreaming(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number
): number;
export function BrotliEncoderCompressStream(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	g: number
): number;
export function BrotliEncoderMallocU8(a: number, b: number): number;
export function BrotliEncoderFreeU8(a: number, b: number, c: number): void;
export function BrotliEncoderMallocUsize(a: number, b: number): number;
export function BrotliEncoderFreeUsize(a: number, b: number, c: number): void;
export function BrotliEncoderMaxCompressedSizeMulti(a: number, b: number): number;
export function BrotliEncoderCompressMulti(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	g: number,
	h: number,
	i: number,
	j: number,
	k: number
): number;
export function BrotliEncoderCreateWorkPool(a: number, b: number, c: number, d: number): number;
export function BrotliEncoderDestroyWorkPool(a: number): void;
export function BrotliEncoderCompressWorkPool(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	g: number,
	h: number,
	i: number,
	j: number,
	k: number,
	l: number
): number;
export function BroccoliCreateInstance(a: number): void;
export function BroccoliCreateInstanceWithWindowSize(a: number, b: number): void;
export function BroccoliDestroyInstance(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	g: number,
	h: number,
	i: number,
	j: number,
	k: number,
	l: number,
	m: number,
	n: number,
	o: number,
	p: number,
	q: number,
	r: number,
	s: number,
	t: number,
	u: number,
	v: number,
	w: number,
	x: number,
	y: number,
	z: number,
	a1: number,
	b1: number,
	c1: number,
	d1: number,
	e1: number,
	f1: number,
	g1: number,
	h1: number,
	i1: number,
	j1: number,
	k1: number,
	l1: number,
	m1: number,
	n1: number,
	o1: number,
	p1: number,
	q1: number,
	r1: number,
	s1: number,
	t1: number,
	u1: number,
	v1: number,
	w1: number,
	x1: number,
	y1: number,
	z1: number,
	a2: number,
	b2: number,
	c2: number,
	d2: number,
	e2: number,
	f2: number,
	g2: number,
	h2: number,
	i2: number,
	j2: number,
	k2: number,
	l2: number,
	m2: number,
	n2: number,
	o2: number,
	p2: number,
	q2: number,
	r2: number,
	s2: number,
	t2: number,
	u2: number,
	v2: number,
	w2: number,
	x2: number,
	y2: number,
	z2: number,
	a3: number,
	b3: number,
	c3: number,
	d3: number,
	e3: number,
	f3: number,
	g3: number,
	h3: number,
	i3: number,
	j3: number,
	k3: number,
	l3: number,
	m3: number,
	n3: number,
	o3: number,
	p3: number,
	q3: number,
	r3: number,
	s3: number,
	t3: number,
	u3: number,
	v3: number,
	w3: number,
	x3: number,
	y3: number,
	z3: number,
	a4: number,
	b4: number,
	c4: number,
	d4: number,
	e4: number,
	f4: number,
	g4: number,
	h4: number,
	i4: number,
	j4: number,
	k4: number,
	l4: number,
	m4: number,
	n4: number,
	o4: number,
	p4: number,
	q4: number
): void;
export function BroccoliNewBrotliFile(a: number): void;
export function BroccoliConcatStream(a: number, b: number, c: number, d: number, e: number): number;
export function BroccoliConcatStreaming(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number
): number;
export function BroccoliConcatFinish(a: number, b: number, c: number): number;
export function BroccoliConcatFinished(a: number, b: number, c: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
