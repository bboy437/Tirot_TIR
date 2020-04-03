import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { Subject } from 'rxjs/Subject';
import { MessageDialogComponent } from '../dialogs/message-dialog/message-dialog.component';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Injectable()
export class DialogService {
  // protected ServerApiUrl = AppConfig.settings.ServerApiUrl;
  public dialogRef: MatDialogRef<MessageDialogComponent>;
  //private errorDialogRef: MatDialogRef<ErrorDialogComponent>;
  public dialogConfirm: MatDialogRef<ConfirmDialogComponent>;

  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();
  //private loaderState : boolean;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) { }

  public getLoader() {
    return this.loaderState;
  }

  public showLoader() {
    //this.loaderState = true;
    this.loaderSubject.next(<LoaderState>{ show: true });
  }

  public hideLoader() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }

  public showDialog(
    type: string,
    title: string,
    body: string,
    width: string = "300px",
    height: string = "200px"
  ) {

    let heightbody = "40px";

    let strarrbody: string[] = body.split('<br/>');
    console.log("strarrbody",strarrbody);
    
   
      if (strarrbody.length > 1) {

        let intheightbody = 40 * strarrbody.length;
        let intheight = 200 + (40 * (strarrbody.length - 2));

        heightbody = intheightbody + "px";
        height = intheight + "px";
      }


      let maxchar: number = 0;
      strarrbody.forEach(strbody => {
        if (strbody.length > maxchar) {
          maxchar = strbody.length;
        }
      });

      if (maxchar > 17) {
        let intwidth = 300 + (15 * (maxchar - 17));
        width = intwidth + "px";
      }
    

    // console.log(height,heightbody);

    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: width,
      height: height,
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body,
        Heightbody: heightbody
      },
      disableClose: true
    });
  }

  public showDialogConfirm(
    type: string,
    title: string,
    body: string,
    width: string = "300px",
    height: string = "200px"
  ) {
    this.dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: width,
      height: height,
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      }
    });
  }

  public showDialogValidate(
    objResultValidate: any,
    width: string = "300px",
    height: string = "200px"
  ) {
    if (objResultValidate.success) {
      if (objResultValidate.arrRequireField.length == 0) {
        return true;
      } else {
        //build body message
        let bodyMessage: string = "";
        objResultValidate.arrRequireField.forEach(element => {
          if (bodyMessage == "") bodyMessage += element;
          else bodyMessage += " , " + element;
        });

        this.showDialog("", "Validate error", bodyMessage, width, height); //Show dialog RequireField
        return false;
      }
    } else {
      //success false
      //build body message
      let bodyMessage: string = "";
      objResultValidate.arrHasNotProperty.forEach(element => {
        if (bodyMessage == "") bodyMessage += element;
        else bodyMessage += " , " + element;
      });

      this.showDialog(
        "",
        "Validate not exist property",
        bodyMessage,
        width,
        height
      );
      return false;
    }
  }
  public showErrorDialog(error: any) {
    let message = error.message;
    if (error.status >= 400 && error.status <= 600) {
      message =
        "เกิดข้อผิดพลาดในการติดต่อกับ application server <br/>กรุณาติดต่อ IT admin เพื่อแก้ไขปัญหา";
    }
    this.showDialog("", "Error", message, "800px");
    // this.errorDialogRef = this.dialog.open(ErrorDialogComponent, {
    //   width: "300px",
    //   height: "200px",
    //   data: {
    //     Messagetype: "Error",
    //     Messagetitle: "Title",
    //     Messagebody: error.Message
    //   },
    //   disableClose: true
    // });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }
}

export interface LoaderState {
  show: boolean;
}
