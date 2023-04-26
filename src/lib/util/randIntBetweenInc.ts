export default function randIntBetweenInc(min: number, max: number) {
    return Math.trunc(min + (Math.random()*(max - min + 1)));
}