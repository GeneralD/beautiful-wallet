import { EMPTY, mergeMap, of, OperatorFunction } from 'rxjs'

export default function <T, R>(project: (value: T, index: number) => R | undefined | null): OperatorFunction<T, R> {
    return mergeMap((v, i) => {
        const result = project(v, i)
        return result ? of(result) : EMPTY
    })
}
