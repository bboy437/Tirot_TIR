import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AnonymousSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';



@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
  

})
export class MessageDialogComponent implements OnInit {



  
  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) { }

  
  
  
  ngOnInit() {
    if(this.data.Heightbody == undefined || this.data.Heightbody == null)
    {
      this.data.Heightbody = "40px";
    }
  }

  OKClick(): void {
    this.dialogRef.close();
  }


  validate(){
    console.log(this.dialogRef.afterOpen);
    let strValidate : string = "";

    if(strValidate != "")
    {
      alert(strValidate);
      return false;
    }
    else
    {
      return true;
    }
   
  }
  // Messagetype: type,
  // Messagetitle: title,
  // Messagebody: body
  
}
