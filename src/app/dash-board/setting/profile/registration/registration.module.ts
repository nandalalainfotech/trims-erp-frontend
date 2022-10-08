import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import { OnlyLetterModule } from 'src/app/shared/modules/onlyLetter.module';
import { OnlyNumberModule } from 'src/app/shared/modules/onlynumber.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    OnlyNumberModule,
		OnlyLetterModule
  ]
})
export class RegistrationModule { }
