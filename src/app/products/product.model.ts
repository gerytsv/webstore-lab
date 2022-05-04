import { OnInit } from '@angular/core';
import { IdType } from './../shared/common-types';
import { Identifiable } from '../shared/common-types';

export class Product implements Identifiable {
  static typeId = 'Product';
  id: IdType | undefined;

  constructor(
    public name: string,
    public price: number,
    public description: string,
    public imageUrl?: string
  ) {}
}
