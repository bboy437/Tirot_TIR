import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { AnonymousSubject } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ErrorDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  OKClick(): void {
    this.dialogRef.close();
  }

  validate() {
    console.log(this.dialogRef.afterOpen);
    let strValidate: string = "";

    if (strValidate != "") {
      alert(strValidate);
      return false;
    } else {
      return true;
    }
  }
}
