import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleFormComponent } from './simple-form/simple-form.component';

@NgModule({
  declarations: [SimpleFormComponent],
  imports: [CommonModule, BrowserModule, FormsModule],
  exports: [SimpleFormComponent],
})
export class SimpleFormModule {}
