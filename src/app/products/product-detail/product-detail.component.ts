import { Product } from './../product.model';
import { PresentationMode } from './../../shared/common-types';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

interface FormErrors {
  [key: string]: string;
}

@Component({
  selector: 'ws-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: PresentationMode = 'present';
  @Input() product: Product = new Product('', 0, '');
  @Output() productSubmitted = new EventEmitter<Product>();
  @Output() productCancelled = new EventEmitter<void>();
  title = 'Product Details';
  isCancelled = false;
  form: FormGroup = new FormGroup({});
  statusSubscription?: Subscription;

  formErrors: FormErrors = {
    name: '',
    price: '',
    descritpion: '',
    imageUrl: '',
  };

  validationMessages: { [key: string]: FormErrors } = {
    name: {
      required: 'Product name is required',
      minlength: 'Product name must be at least 2 charcters long',
      maxlength: 'Product name must be no more than 24 characters long',
    },
    price: {
      required: 'Product price is required',
      min: 'Price should be positive number',
    },
    descritpion: {
      minlength: 'Product description must be at least 2 charcters long',
      maxlength: 'Product description must be no more than 512 charcters long',
    },
    imageUrl: {
      pattern:
        'Product image URL should be valid URL (ex. http://example.com/image.jpg)',
    },
  };

  get isNewProduct() {
    return !this.product || !this.product.id;
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const productChange = changes['product'];
    if (
      productChange &&
      productChange.currentValue !== productChange.previousValue
    )
      this.reset();
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) this.statusSubscription.unsubscribe();
  }

  getFormValue(field: string) {
    return this.form?.get(field)?.value;
  }

  submitForm() {
    this.product = this.form.getRawValue();
    this.productSubmitted.emit(this.product);
    this.reset();
  }

  reset() {
    if (this.form && this.product) {
      this.form.reset(this.product);
    }
  }

  cancelProduct() {
    this.productCancelled.emit();
    this.isCancelled = true;
  }

  protected onStatusChanged() {
    if (!this.form) return;
    const form = this.form;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      const isFormEdited = control?.dirty || control?.touched;
      if (control && isFormEdited && control.invalid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ', ';
        }
      }
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: { value: this.product.id, disabled: true },
      name: [
        this.product.name,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(24),
        ],
      ],
      price: [
        this.product.price,
        [Validators.required, Validators.minLength(2), Validators.maxLength(9)],
      ],
      description: [
        this.product.description,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(512),
        ],
      ],
      imageUrl: [
        this.product.imageUrl,
        [
          Validators.pattern(
            /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/
          ),
        ],
      ],
    });
    this.statusSubscription = this.form.statusChanges.subscribe(() =>
      this.onStatusChanged()
    );
  }
}
