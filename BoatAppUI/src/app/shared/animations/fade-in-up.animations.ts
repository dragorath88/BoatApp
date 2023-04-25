import { Directive } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// Trigger for the animation
export const fadeInUpAnimation = trigger('fadeInUp', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(3vh)',
    }),
    animate(
      '400ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({
        opacity: 1,
        transform: 'translateY(0)',
      })
    ),
  ]),
]);

// Directive to apply the trigger to an element
@Directive({
  selector: '[fadeInUpStaggerElement]',
})
export class FadeInUpStaggerElementDirective {}
