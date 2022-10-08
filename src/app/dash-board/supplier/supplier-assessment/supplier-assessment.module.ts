import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierAssessmentRoutingModule } from './supplier-assessment-routing.module';
import { OnlyNumberModule } from 'src/app/shared/modules/onlynumber.module';
import { OnlyLetterModule } from 'src/app/shared/modules/onlyLetter.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SupplierAssessmentRoutingModule,
    OnlyNumberModule,
		OnlyLetterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SupplierAssessmentModule { }
