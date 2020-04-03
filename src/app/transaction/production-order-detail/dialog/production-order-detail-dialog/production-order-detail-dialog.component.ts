import { Component, OnInit, Inject } from "@angular/core";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { IProduct, IOrderItem } from "../../../../interfaces/productionrecords";
import { BrokerAPIService } from "../../../../services/brokerapi.service";

@Component({
  selector: "app-production-order-detail-dialog",
  templateUrl: "./production-order-detail-dialog.component.html",
  styleUrls: ["./production-order-detail-dialog.component.scss"]
})
export class ProductionOrderDetailDialogComponent implements OnInit {

  private UrlAPI_GetAllFG: string = "Product/GetAllFG";

  arrobjProduct: any = [];
  arrobjItemNo : any = [];
  arrobjOrderQty: any = [];
  processSelected: any = {};

  private intOlditemNo: number;
  intOldProductID: number;
  private intOldOrderQty: number;
 
  public strDialogStatus: string;

  constructor(
    public dialogRef: MatDialogRef<ProductionOrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataOrderItem: IOrderItem,
    private brokerAPIService: BrokerAPIService
  ) {}

  ngOnInit() {
    this.setSelectProduct();

    console.log(this.dataOrderItem);
    if(this.dataOrderItem.id == 0)
    {
      this.strDialogStatus = "Add";
      let itemNo = this.dataOrderItem.itemNo;
      console.log(itemNo);
      this.dataOrderItem = <IOrderItem> {};
      this.dataOrderItem.createBy = "admin";
      this.dataOrderItem.orderQty=(null);
      this.dataOrderItem.id= (null);
      this.dataOrderItem.itemNo = itemNo;

      this.dataOrderItem.product  = <IProduct> {};
      this.dataOrderItem.product.id = (null);

      console.log("ngOnInit add");
      console.log(this.dataOrderItem);
    } else {
      this.strDialogStatus = "Edit";
      this.intOlditemNo = this.dataOrderItem.itemNo;
      this.intOldProductID = this.dataOrderItem.product.id;
      
      this.intOldOrderQty = this.dataOrderItem.orderQty;
      
      // console.log("this.dataOrderItem.orderQty");
      // console.log(this.dataOrderItem.orderQty);
    }
  }

  formControl = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {

    if (this.strDialogStatus == "Edit") {

      this.dataOrderItem.product = this.arrobjProduct.find(x => x.id === this.intOldProductID);
      this.dataOrderItem.itemNo = this.intOlditemNo;
      this.dataOrderItem.orderQty = this.intOldOrderQty;
    }

    this.dialogRef.close();
  }

  // public confirmAdd(): void {

  //   this.dataOrderItem.product = this.arrobjProduct.find(x => x.id === this.dataOrderItem.product.id);
  //   console.log(this.dataOrderItem);

  // }
  public confirmAdd(): void {
    console.log("confirmAdd");

     this.dataOrderItem
   
  }

  setSelectProduct() {
    this.brokerAPIService.get(this.UrlAPI_GetAllFG).subscribe(
      data => {
        this.arrobjProduct = data;
      }
    );
  }

  ddlProduct_SelectIndexChange(data){
    this.dataOrderItem.product = this.arrobjProduct.find(x => x.id === data);
  }

}
