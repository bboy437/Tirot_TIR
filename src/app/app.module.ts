
import { APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LazyLoadModule } from './lazy-load/lazy-load.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AuthGuardService } from './auth/service/auth-guard.service';
import { AuthService } from './auth/service/auth.service';
import { routing } from './app.routing';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { GlobalsValue } from '../app/globals.value';
import { BrokerAPIService } from './services/brokerapi.service';
import { DialogService } from './services/dialog.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteDialogComponent } from './dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { CalendarModule } from 'angular-calendar';
// import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { DatePipe } from '@angular/common'

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {
  MatSnackBarModule,
  MatCardModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatCheckboxModule,
  MatListModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatSelectModule,
  MatDialogModule,
  MatGridListModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
  MatRadioModule,
  MatStepperModule
} from '@angular/material';
import { MomentUtcDateAdapter } from './moment-utc-date-adapter';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { AppConfig } from './app.config';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';


export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDeleteDialogComponent,
    MessageDialogComponent,
    ErrorDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    AngularFontAwesomeModule,
    BrowserModule,
    LazyLoadModule,
    CoreModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    // NgbModalModule.forRoot(),
    routing,
    HttpModule,
    HttpClientModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    TextMaskModule,
    MatRadioModule,
    MatStepperModule
  ],
  providers: [
    DatePipe,
    AuthGuardService,
    AuthService,
    GlobalsValue,
    BrokerAPIService,
    DialogService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    }
  ],
  entryComponents: [
    ConfirmDeleteDialogComponent,
    MessageDialogComponent,
    ErrorDialogComponent,
    ConfirmDialogComponent
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
