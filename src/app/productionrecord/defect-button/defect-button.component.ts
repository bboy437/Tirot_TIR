import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-defect-button',
  templateUrl: './defect-button.component.html',
  styleUrls: ['./defect-button.component.scss']
})
export class DefectButtonComponent implements OnInit {

  @Input() objDefect: any = {};
  @Input() productionRecordId: number;
  @Input() workerId: number;
  @Input() Length: number;
  @Input() defectPosition: string;
  @Input() Editable: boolean;
  @Output() isSaveComplete = new EventEmitter<boolean>();

  isClick: boolean = false;
  isClickValue: number = 0;
  objAPIResponse: any;
  defactToLength: number;


  private UrlAPI_AddInlineInspection: string = "ProductionRecord/AddInlineInspection";
  defectPositionStart: any;

  constructor(private brokerAPIService: BrokerAPIService,
    private dialogService: DialogService, ) { }

  ngOnInit() {


  }


 async getdata() {
    try {
      let objdata: any = {};
      objdata.productionRecordId = this.productionRecordId;
      objdata.workerId = this.workerId;
      if (this.objDefect.defectType == "L") {
        objdata.defectAtLength = this.defactToLength;
        objdata.defactToLength = this.Length;
        objdata.defectPosition = this.defectPositionStart;
      }
      else {
        objdata.defactToLength = 0;
        objdata.defectAtLength = this.Length;
        objdata.defectPosition = this.defectPosition;
      }

      objdata.defectId = this.objDefect.id;
      objdata.remark = "";
      objdata.createBy = localStorage.getItem("currentUserName");
      objdata.updateBy = localStorage.getItem("currentUserName");
      console.log("btnDefect", objdata);

      return await objdata;
    } catch (error) {
      throw error;
    }
  }

  async btnDefectClick() {
    this.dialogService.showLoader();
    try {
      if (this.objDefect.defectType == "S") {
        /// Spot
        console.log("S");
        await this.savaDefect(await this.getdata());
      }
      else {
        /// Line
        if (this.isClick) {
          //End Defect
          this.isClickValue = 0;
          this.isClick = false;
          await this.savaDefect(await this.getdata());
        }
        else {
          //Start Defect
          this.isClickValue = 100;
          this.isClick = true;
          this.defactToLength = this.Length;
          this.defectPositionStart = this.defectPosition;
          // this.isSaveComplete.emit(true);
          // this.showSnackBar("Save Complete");
        }
        //console.log(this.isClick);
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async savaDefect(objInlineInspection) {

    try {
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_AddInlineInspection, objInlineInspection);
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");
        this.isSaveComplete.emit(true);
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
        console.log(
          "this.objAPIResponse :" + JSON.stringify(this.objAPIResponse)
        );
      }

    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.post(this.UrlAPI_AddInlineInspection, objInlineInspection).subscribe(
    //   data => {
    //     this.objAPIResponse = <IAPIResponse>data;
    //     if (this.objAPIResponse.success) {
    //       this.showSnackBar("Save Complete");
    //       this.isSaveComplete.emit(true);
    //     } else {
    //       this.showSnackBar("Save Error");
    //       console.log(
    //         "this.objAPIResponse :" + JSON.stringify(this.objAPIResponse)
    //       );
    //     }
    //   },
    //   err => {
    //     // กรณี error
    //     console.log("Something went wrong!");

    //     this.isSaveComplete.emit(false);
    //   }
    // );
  }


  // showSnackBar(message: string) {
  //   this.snackBar.open(message, "", {
  //     duration: 2000
  //   });
  // }

}
