/**
 * @since 3.0.0
 */
import { Alt4 } from './Alt'
import { Applicative4 } from './Applicative'
import { apFirst_, Apply4, apSecond_, apS_, apT_ } from './Apply'
import { Bifunctor4 } from './Bifunctor'
import * as E from './Either'
import { filterOrElse_, FromEither4, fromOption_, fromPredicate_ } from './FromEither'
import { FromIO4 } from './FromIO'
import { FromTask4 } from './FromTask'
import { flow, identity, pipe, Predicate, Refinement } from './function'
import { bindTo_, Functor4, tupled_ } from './Functor'
import { IO } from './IO'
import { IOEither } from './IOEither'
import { bind_, chainFirst_, Monad4 } from './Monad'
import { Pointed4 } from './Pointed'
import { Reader } from './Reader'
import { ReaderEither } from './ReaderEither'
import * as RTE from './ReaderTaskEither'
import { State } from './State'
import * as ST from './StateT'
import { Task } from './Task'
import { TaskEither } from './TaskEither'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

import ReaderTaskEither = RTE.ReaderTaskEither
import Either = E.Either

/**
 * @category model
 * @since 3.0.0
 */
export interface StateReaderTaskEither<S, R, E, A> {
  (s: S): ReaderTaskEither<R, E, readonly [A, S]>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const left: <E, S, R, A = never>(e: E) => StateReaderTaskEither<S, R, E, A> = (e) => () => RTE.left(e)

/**
 * @category constructors
 * @since 3.0.0
 */
export const right: <A, S, R, E = never>(a: A) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  ST.of_(RTE.Pointed)

/**
 * @category constructors
 * @since 3.0.0
 */
export const rightTask = <A, S, R, E = never>(ma: Task<A>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.rightTask(ma))

/**
 * @category constructors
 * @since 3.0.0
 */
export const leftTask = <E, S, R, A = never>(me: Task<E>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.leftTask(me))

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromTaskEither = <E, A, S, R>(ma: TaskEither<E, A>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.fromTaskEither(ma))

/**
 * @category constructors
 * @since 3.0.0
 */
export const rightReader = <R, A, S, E = never>(ma: Reader<R, A>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.rightReader(ma))

/**
 * @category constructors
 * @since 3.0.0
 */
export const leftReader = <R, E, S, A = never>(me: Reader<R, E>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.leftReader(me))

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromIOEither = <E, A, S, R>(ma: IOEither<E, A>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.fromIOEither(ma))

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromReaderEither = <R, E, A, S>(ma: ReaderEither<R, E, A>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.fromReaderEither(ma))

/**
 * @category constructors
 * @since 3.0.0
 */
export const rightIO = <A, S, R, E = never>(ma: IO<A>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.rightIO(ma))

/**
 * @category constructors
 * @since 3.0.0
 */
export const leftIO = <E, S, R, A = never>(me: IO<E>): StateReaderTaskEither<S, R, E, A> =>
  fromReaderTaskEither(RTE.leftIO(me))

/**
 * @category constructors
 * @since 3.0.0
 */
export const rightState: <S, A, R, E = never>(ma: State<S, A>) => StateReaderTaskEither<S, R, E, A> = (sa) =>
  flow(sa, RTE.right)

/**
 * @category constructors
 * @since 3.0.0
 */
export const leftState: <S, E, R, A = never>(me: State<S, E>) => StateReaderTaskEither<S, R, E, A> = (me) => (s) =>
  RTE.left(me(s)[0])

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromReaderTaskEither =
  /*#__PURE__*/
  ST.fromF_(RTE.Functor)

/**
 * Get the current state
 *
 * @category constructors
 * @since 3.0.0
 */
export const get =
  /*#__PURE__*/
  ST.get_(RTE.Pointed)

/**
 * Set the state
 *
 * @category constructors
 * @since 3.0.0
 */
export const put =
  /*#__PURE__*/
  ST.put_(RTE.Pointed)

/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 3.0.0
 */
export const modify =
  /*#__PURE__*/
  ST.modify_(RTE.Pointed)

/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 3.0.0
 */
export const gets =
  /*#__PURE__*/
  ST.gets_(RTE.Pointed)

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromState =
  /*#__PURE__*/
  ST.fromState_(RTE.Pointed)

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromEither: FromEither4<URI>['fromEither'] =
  /*#__PURE__*/
  E.fold((e) => left(e), right)

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromIO: FromIO4<URI>['fromIO'] = rightIO

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromTask: FromTask4<URI>['fromTask'] = rightTask

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 3.0.0
 */
export const fromEitherK = <A extends ReadonlyArray<unknown>, E, B>(
  f: (...a: A) => Either<E, B>
): (<S, R>(...a: A) => StateReaderTaskEither<S, R, E, B>) => (...a) => fromEither(f(...a))

/**
 * Less strict version of [`chainEitherK`](#chainEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainEitherKW = <A, E2, B>(f: (a: A) => Either<E2, B>) => <S, R, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainEitherK: <E, A, B>(
  f: (a: A) => Either<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainEitherKW

/**
 * @category combinators
 * @since 3.0.0
 */
export const fromIOEitherK = <A extends ReadonlyArray<unknown>, E, B>(
  f: (...a: A) => IOEither<E, B>
): (<S, R>(...a: A) => StateReaderTaskEither<S, R, E, B>) => (...a) => fromIOEither(f(...a))

/**
 * Less strict version of [`chainIOEitherK`](#chainIOEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainIOEitherKW = <A, E2, B>(f: (a: A) => IOEither<E2, B>) => <S, R, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromIOEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainIOEitherK: <E, A, B>(
  f: (a: A) => IOEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainIOEitherKW

/**
 * @category combinators
 * @since 3.0.0
 */
export const fromTaskEitherK = <A extends ReadonlyArray<unknown>, E, B>(
  f: (...a: A) => TaskEither<E, B>
): (<S, R>(...a: A) => StateReaderTaskEither<S, R, E, B>) => (...a) => fromTaskEither(f(...a))

/**
 * Less strict version of [`chainTaskEitherK`](#chainTaskEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainTaskEitherKW = <A, E2, B>(f: (a: A) => TaskEither<E2, B>) => <S, R, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromTaskEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainTaskEitherK: <E, A, B>(
  f: (a: A) => TaskEither<E, B>
) => <S, R>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainTaskEitherKW

/**
 * @category combinators
 * @since 3.0.0
 */
export const fromReaderTaskEitherK = <A extends ReadonlyArray<unknown>, R, E, B>(
  f: (...a: A) => ReaderTaskEither<R, E, B>
): (<S>(...a: A) => StateReaderTaskEither<S, R, E, B>) => (...a) => fromReaderTaskEither(f(...a))

/**
 * Less strict version of [`chainReaderTaskEitherK`](#chainReaderTaskEitherK).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainReaderTaskEitherKW = <A, R, E2, B>(f: (a: A) => ReaderTaskEither<R, E2, B>) => <S, E1>(
  ma: StateReaderTaskEither<S, R, E1, A>
): StateReaderTaskEither<S, R, E1 | E2, B> => pipe(ma, chainW<A, S, R, E2, B>(fromReaderTaskEitherK(f)))

/**
 * @category combinators
 * @since 3.0.0
 */
export const chainReaderTaskEitherK: <R, E, A, B>(
  f: (a: A) => ReaderTaskEither<R, E, B>
) => <S>(ma: StateReaderTaskEither<S, R, E, A>) => StateReaderTaskEither<S, R, E, B> = chainReaderTaskEitherKW

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 3.0.0
 */
export const map: Functor4<URI>['map'] =
  /*#__PURE__*/
  ST.map_(RTE.Functor)

/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 3.0.0
 */
export const bimap: Bifunctor4<URI>['bimap'] = (f, g) => (fea) => (s) =>
  pipe(
    fea(s),
    RTE.bimap(f, ([a, s]) => [g(a), s])
  )

/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 3.0.0
 */
export const mapLeft: Bifunctor4<URI>['mapLeft'] = (f) => (fea) => flow(fea, RTE.mapLeft(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 3.0.0
 */
export const ap: Apply4<URI>['ap'] =
  /*#__PURE__*/
  ST.ap_(RTE.Monad)

/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 3.0.0
 */
export const apW: <S, R2, E2, A>(
  fa: StateReaderTaskEither<S, R2, E2, A>
) => <R1, E1, B>(
  fab: StateReaderTaskEither<S, R1, E1, (a: A) => B>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B> = ap as any

/**
 * @category Pointed
 * @since 3.0.0
 */
export const of: Pointed4<URI>['of'] = right

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 3.0.0
 */
export const chain: Monad4<URI>['chain'] =
  /*#__PURE__*/
  ST.chain_(RTE.Monad)

/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 3.0.0
 */
export const chainW: <A, S, R2, E2, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(ma: StateReaderTaskEither<S, R1, E1, A>) => StateReaderTaskEither<S, R1 & R2, E1 | E2, B> = chain as any

/**
 * Derivable from `Monad`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const flatten: <S, R, E, A>(
  mma: StateReaderTaskEither<S, R, E, StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 3.0.0
 */
export const altW = <S, R2, E2, B>(second: () => StateReaderTaskEither<S, R2, E2, B>) => <R1, E1, A>(
  first: StateReaderTaskEither<S, R1, E1, A>
): StateReaderTaskEither<S, R1 & R2, E1 | E2, A | B> => (r) =>
  pipe(
    first(r),
    RTE.altW(() => second()(r))
  )

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 3.0.0
 */
export const alt: Alt4<URI>['alt'] = altW

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export type URI = 'StateReaderTaskEither'

declare module './HKT' {
  interface URItoKind4<S, R, E, A> {
    readonly StateReaderTaskEither: StateReaderTaskEither<S, R, E, A>
  }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Functor: Functor4<URI> = {
  map
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Pointed: Pointed4<URI> = {
  map,
  of
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Apply: Apply4<URI> = {
  map,
  ap
}

/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const apFirst =
  /*#__PURE__*/
  apFirst_(Apply)

/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const apSecond =
  /*#__PURE__*/
  apSecond_(Apply)

/**
 * @category instances
 * @since 3.0.0
 */
export const Applicative: Applicative4<URI> = {
  map,
  ap,
  of
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Bifunctor: Bifunctor4<URI> = {
  bimap,
  mapLeft
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Alt: Alt4<URI> = {
  map,
  alt
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Monad: Monad4<URI> = {
  map,
  of,
  chain
}

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category derivable combinators
 * @since 3.0.0
 */
export const chainFirst =
  /*#__PURE__*/
  chainFirst_(Monad)

/**
 * Less strict version of [`chainFirst`](#chainFirst).
 *
 * @category combinators
 * @since 3.0.0
 */
export const chainFirstW: <A, S, R2, E2, B>(
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  first: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, A> = chainFirst as any

/**
 * @category instances
 * @since 3.0.0
 */
export const FromIO: FromIO4<URI> = {
  fromIO
}

/**
 * @category instances
 * @since 3.0.0
 */
export const FromTask: FromTask4<URI> = {
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 3.0.0
 */
export const FromEither: FromEither4<URI> = {
  fromEither
}

/**
 * Derivable from `FromEither`.
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromOption =
  /*#__PURE__*/
  fromOption_(FromEither)

/**
 * Derivable from `FromEither`.
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromPredicate =
  /*#__PURE__*/
  fromPredicate_(FromEither)

/**
 * @category combinators
 * @since 3.0.0
 */
export const filterOrElse =
  /*#__PURE__*/
  filterOrElse_<URI>({
    map,
    of,
    chain,
    fromEither
  })

/**
 * Less strict version of [`filterOrElse`](#filterOrElse).
 *
 * @category combinators
 * @since 3.0.0
 */
export const filterOrElseW: {
  <A, B extends A, E2>(refinement: Refinement<A, B>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, B>
  <A, E2>(predicate: Predicate<A>, onFalse: (a: A) => E2): <S, R, E1>(
    ma: StateReaderTaskEither<S, R, E1, A>
  ) => StateReaderTaskEither<S, R, E1 | E2, A>
} = filterOrElse

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 3.0.0
 */
export const evaluate =
  /*#__PURE__*/
  ST.evaluate_(RTE.Functor)

/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 3.0.0
 */
export const execute =
  /*#__PURE__*/
  ST.execute_(RTE.Functor)

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const bindTo =
  /*#__PURE__*/
  bindTo_(Functor)

/**
 * @since 3.0.0
 */
export const bind =
  /*#__PURE__*/
  bind_(Monad)

/**
 * Less strict version of [`bind`](#bind).
 *
 * @since 3.0.0
 */
export const bindW: <N extends string, A, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> = bind as any

// -------------------------------------------------------------------------------------
// sequence S
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const apS =
  /*#__PURE__*/
  apS_(Apply)

/**
 * Less strict version of [`apS`](#apS).
 *
 * @since 3.0.0
 */
export const apSW: <A, N extends string, S, R2, E2, B>(
  name: Exclude<N, keyof A>,
  fb: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1>(
  fa: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, { [K in keyof A | N]: K extends keyof A ? A[K] : B }> = apS as any

// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------

/**
 * @since 3.0.0
 */
export const tupled =
  /*#__PURE__*/
  tupled_(Functor)

/**
 * @since 3.0.0
 */
export const apT =
  /*#__PURE__*/
  apT_(Apply)

/**
 * Less strict version of [`apT`](#apT).
 *
 * @since 3.0.0
 */
export const apTW: <S, R2, E2, B>(
  fb: StateReaderTaskEither<S, R2, E2, B>
) => <R1, E1, A extends ReadonlyArray<unknown>>(
  fas: StateReaderTaskEither<S, R1, E1, A>
) => StateReaderTaskEither<S, R1 & R2, E1 | E2, readonly [...A, B]> = apT as any

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 3.0.0
 */
export const traverseReadonlyArrayWithIndex = <A, S, R, E, B>(
  f: (index: number, a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyArray<A>): StateReaderTaskEither<S, R, E, ReadonlyArray<B>> => (s) => (r) => async () => {
  let out = s
  // tslint:disable-next-line: readonly-array
  const bs: Array<B> = []
  for (let i = 0; i < as.length; i++) {
    const e = await f(i, as[i])(out)(r)()
    if (E.isLeft(e)) {
      return e
    }
    const [b, s2] = e.right
    bs.push(b)
    out = s2
  }
  return E.right([bs, out])
}

/**
 * Equivalent to `ReadonlyArray#traverse(Applicative)`.
 *
 * @since 3.0.0
 */
export const traverseReadonlyArray: <A, S, R, E, B>(
  f: (a: A) => StateReaderTaskEither<S, R, E, B>
) => (as: ReadonlyArray<A>) => StateReaderTaskEither<S, R, E, ReadonlyArray<B>> = (f) =>
  traverseReadonlyArrayWithIndex((_, a) => f(a))

/**
 * Equivalent to `ReadonlyArray#sequence(Applicative)`.
 *
 * @since 3.0.0
 */
export const sequenceReadonlyArray: <S, R, E, A>(
  as: ReadonlyArray<StateReaderTaskEither<S, R, E, A>>
) => StateReaderTaskEither<S, R, E, ReadonlyArray<A>> =
  /*#__PURE__*/
  traverseReadonlyArray(identity)
