import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(8px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('120ms ease-out', style({ opacity: 0, transform: 'translateY(-4px)' }))
      ], { optional: true }),
      query(':enter', [
        animate('160ms 40ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ]),
    query(':enter', animateChild(), { optional: true })
  ])
]);

export function prepareRoute(outlet: RouterOutlet): string | null {
  if (!outlet || !outlet.isActivated){
    return '';
  }
  return outlet?.activatedRouteData?.['animation'] ?? outlet?.activatedRoute?.routeConfig?.path ?? null;
}
