import {BehaviorSubject, filter, first, Observable} from "rxjs";

export function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export function get<T>(subject: BehaviorSubject<T | null>): Observable<T> {
  return subject.pipe(filter(isNonNull), first());
}

export function nonnull<T>(subject: BehaviorSubject<T | null>): Observable<T> {
  return subject.pipe(filter(isNonNull));
}
