import { Subject, Observable } from "rxjs";
import { map, mergeAll } from "rxjs/operators";

export type Activity$<T = any> = Observable<T>;
export type Activities$<T = any> = Observable<[string, T]>;
export type ActivityMapper<T = any> = Subject<{
  key: string,
  activity$: Activity$<T>
}>;

export default class ActivitiesListener$ {
  private activityMapper$: ActivityMapper = new Subject();
  private activities$: Activities$ = this.activityMapper$.asObservable().pipe(
    map((mapRequest) => mapRequest.activity$.pipe(
      map((value) => ([mapRequest.key, value]) as [string, any]),
    )),
    mergeAll(),
  );

  protected addActivity(key: string, activity$: Activity$) {
    this.activityMapper$.next({ key, activity$ });
  }

  protected composeActivites(key: string, activities$: Activities$) {
    this.addActivity(key, activities$);
  }

  public getActivities$() {
    return this.activities$;
  }
}