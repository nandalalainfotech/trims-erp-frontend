import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreakDownRegisterRoutingModule } from './break-down-register-routing.module';
import { OnlyNumberModule } from 'src/app/shared/modules/onlynumber.module';
import { OnlyLetterModule } from 'src/app/shared/modules/onlyLetter.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BreakDownRegisterRoutingModule,
    OnlyNumberModule,
		OnlyLetterModule
  ]
})
export class BreakDownRegisterModule { }
