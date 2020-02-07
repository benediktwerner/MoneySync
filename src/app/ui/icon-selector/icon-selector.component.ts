import {
  Component,
  HostBinding,
  Input,
  Optional,
  Self,
  ElementRef,
  HostListener,
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  NgControl,
  ControlValueAccessor,
  FormControl,
  NgForm,
  FormGroupDirective,
} from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FocusMonitor } from '@angular/cdk/a11y';

const icons: string[] = [
  'money',
  'attach_money',
  'monetization_on',
  'euro_symbol',
  'credit_card',
  'account_balance',
  'account_balance_wallet',
  'book',
  'build',
  'card_giftcard',
  'card_membership',
  'card_travel',
  'commute',
  'favorite',
  'favorite_border',
  'grade',
  'gavel',
  'language',
  'motorcycle',
  'pets',
  'shopping_basket',
  'shopping_cart',
  'stars',
  'theaters',
  'timeline',
  'subscriptions',
  'business',
  'phone',
  'airplanemode_active',
  'computer',
  'desktop_windows',
  'devices_other',
  'gamepad',
  'headset',
  'watch',
  'nature',
  'train',
  'local_pizza',
  'local_cafe',
  'local_bar',
  'local_atm',
  'flight',
  'fastfood',
  'directions_car',
  'directions_bike',
  'child_friendly',
  'pool',
  'golf_course',
];

@Component({
  selector: 'app-icon-selector',
  templateUrl: './icon-selector.component.html',
  styleUrls: ['./icon-selector.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: IconSelectorComponent }],
})
export class IconSelectorComponent implements MatFormFieldControl<string>, ControlValueAccessor {
  formControl: FormControl = new FormControl();
  filteredIcons: Observable<string[]>;
  stateChanges = new Subject<void>();
  controlType = 'icon-selector';
  focused = false;

  static nextId = 0;
  @HostBinding() id = `icon-selector-${IconSelectorComponent.nextId++}`;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private form: FormGroupDirective
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this.filteredIcons = this.formControl.valueChanges.pipe(
      startWith(''),
      map(icon => (icon ? this._filterIcons(icon) : icons.slice()))
    );
  }

  get value(): string {
    return this.formControl.value;
  }
  set value(val: string) {
    this.formControl.setValue(val);
    this.stateChanges.next();
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(plh: string) {
    this._placeholder = plh;
  }
  private _placeholder: string = 'Icon';

  get empty(): boolean {
    return !this.formControl.value;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = req;
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled() {
    return this.formControl.disabled;
  }
  set disabled(dis) {
    if (dis) this.formControl.disable();
    else this.formControl.enable();
    this.stateChanges.next();
  }

  errorState: boolean;

  ngDoCheck() {
    const oldState = this.errorState;
    const newState = !!(
      this.ngControl.errors &&
      (this.ngControl.touched || (this.form && this.form.submitted))
    );

    if (oldState !== newState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  writeValue(val: string) {
    this.value = val;
  }
  registerOnChange(fn: any) {
    this.stateChanges.subscribe(() => fn(this.value));
  }
  onTouched: () => void;
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  @HostListener('focusout')
  onBlur() {
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  private _filterIcons(value: string): string[] {
    const filterValue = value.toLowerCase();

    return icons.filter(icon => icon.indexOf(filterValue) !== -1);
  }
}
