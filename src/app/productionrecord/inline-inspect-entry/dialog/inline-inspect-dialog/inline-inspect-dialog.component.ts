import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { BrokerAPIService } from '../../../../services/brokerapi.service';
import { FormControl, Validators } from '@angular/forms';
import { ConfirmDeleteDialogComponent } from '../../../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { IAPIResponse } from '../../../../interfaces/apiResponse';
import { DialogService } from '../../../../services/dialog.service';
import { async } from 'q';

@Component({
  selector: 'app-inline-inspect-dialog',
  templateUrl: './inline-inspect-dialog.component.html',
  styleUrls: ['./inline-inspect-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InlineInspectDialogComponent implements OnInit {
  dialogRefDelete: MatDialogRef<ConfirmDeleteDialogComponent>;
  private UrlAPI_GetAllFG: string = "Product/GetAllFG";
  private UrlAPI_Defect_GetAllActive: string = "Defect/GetAllActive";

  arrobjProduct: any = [];
  arrobjItemNo: any = [];
  arrobjOrderQty: any = [];
  processSelected: any = {};

  private intOlditemNo: number;
  intOldDefectID: number;
  private intOldOrderQty: number;

  public strDialogStatus: string;
  objarrDefect: any;
  isDefectLine: boolean;
  objAPIResponse: any;

  private UrlAPI_RemoveRowInlineInspection: string = "ProductionRecord/RemoveRowInlineInspection";
  private UrlAPI_UpdateInlineInspection: string = "ProductionRecord/UpdateInlineInspection";

  constructor(
    public dialogRef: MatDialogRef<InlineInspectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDefect: any,
    private brokerAPIService: BrokerAPIService,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.setSelectProduct();
    this.getDefect();
    console.log(this.dataDefect);
    this.checkDefectType();
    this.intOldDefectID = this.dataDefect.defectId;
  }

  formControl = new FormControl('', [Validators.required]);

  private checkDefectType() {
    if (this.dataDefect.defect.defectType == 'L') {
      this.isDefectLine = true;
    }
    else {
      this.isDefectLine = false;
    }
    console.log("isDefectLine", this.isDefectLine);
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {


    this.dataDefect.defect = this.objarrDefect.find(x => x.id === this.intOldDefectID);
    // this.dataDefect.itemNo = this.intOlditemNo;
    // this.dataDefect.orderQty = this.intOldOrderQty;


    this.dialogRef.close();
  }

  // public confirmAdd(): void {

  //   this.dataOrderItem.product = this.arrobjProduct.find(x => x.id === this.dataOrderItem.product.id);
  //   console.log(this.dataOrderItem);

  // }

  public async confirmAdd() {
    // console.log("confirmAdd");
    try {
      await this.updateDefect(this.dataDefect);
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

  }

  setSelectProduct() {
    this.brokerAPIService.get(this.UrlAPI_GetAllFG).subscribe(
      data => {
        this.arrobjProduct = data;
      }
    );
  }

  getDefect() {
    this.brokerAPIService.get(this.UrlAPI_Defect_GetAllActive).subscribe(data => {
      this.objarrDefect = data;
      console.log("objarrDefect", this.objarrDefect);
    });
  }

  defectChange(defectdata) {
    this.dataDefect.defect = this.objarrDefect.find(x => x.id === defectdata);
  }


  ddlProduct_SelectIndexChange(data) {
    this.dataDefect.product = this.arrobjProduct.find(x => x.id === data);
  }

  async deleteItemClick() {
    try {
      this.dialogRefDelete = this.dialog.open(ConfirmDeleteDialogComponent, {
        // data: {id: id, title: title, state: state, url: url}
        disableClose: true
      });

      await this.dialogRefDelete.afterClosed().subscribe(async result => {
        try {
          if (result) {
            console.log(result);
            this.dialogService.showLoader();
            await this.removeDefect(this.dataDefect);
          }
        } catch (error) {

          this.dialogService.showErrorDialog(error);
        }
        this.dialogService.hideLoader();
      });
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  async updateDefect(objInlineInspection) {

    try {
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_UpdateInlineInspection, objInlineInspection);
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");
        this.dialogRef.close();
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.post(this.UrlAPI_UpdateInlineInspection, objInlineInspection).subscribe(
    //   data => {
    //     this.objAPIResponse = <IAPIResponse>data;
    //     if (this.objAPIResponse.success) {
    //       this.dialogRef.close();
    //       this.showSnackBar("Save Complete");
    //     } else {
    //       console.log(
    //         "this.objAPIResponse.success :" + this.objAPIResponse.success
    //       );
    //     }
    //   },
    //   err => {
    //     // กรณี error
    //     console.log("Something went wrong!");
    //   }
    // );
  }

  async removeDefect(objInlineInspection) {
    try {
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_RemoveRowInlineInspection, objInlineInspection);
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Delete Complete");
        this.dialogRef.close();
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.post(this.UrlAPI_RemoveRowInlineInspection, objInlineInspection).subscribe(
    //   data => {
    //     this.objAPIResponse = <IAPIResponse>data;
    //     if (this.objAPIResponse.success) {
    //       this.dialogRef.close();
    //       this.showSnackBar("Delete Complete");
    //     } else {
    //       console.log(
    //         "this.objAPIResponse.success :" + this.objAPIResponse.success
    //       );
    //     }
    //   },
    //   err => {
    //     // กรณี error
    //     console.log("Something went wrong!");
    //   }
    // );
  }

 


}
