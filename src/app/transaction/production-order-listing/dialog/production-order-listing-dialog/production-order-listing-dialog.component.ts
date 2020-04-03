import { Component, OnInit, ViewChild } from "@angular/core";
import { Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import { FormControl, Validators } from "@angular/forms";

import {
  IOperationInstruction,
  IProcess,
  IProduct
} from "../../../../interfaces/productionrecords";
import { BrokerAPIService } from "../../../../services/brokerapi.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-production-order-listing-dialog',
  templateUrl: './production-order-listing-dialog.component.html',
  styleUrls: ['./production-order-listing-dialog.component.scss']
})
export class ProductionOrderListingDialogComponent implements OnInit {

  private UrlAPI_GetAllProcess: string = "Process/GetAll";
  private UrlAPI_GetRawMaterialAndWIP: string =
    "RawMaterial/GetRawMaterialAndWIP";
  private UrlAPI_GetAllProduct: string = "Product/GetAll";
  private Url_Detail: string = "/auth/transaction/production-order-detail";

  arrobjProcess: any = [];
  arrobjRawMaterial: any = [];
  arrobjProduct: any = [];
  processSelected: any = {};

  private intOldProcessID: number;
  public intProcessID: number;
  private strOldRawMaterial: string;
  public intProductID: number;
  private intOldProductID: number;
  public strDialogStatus: string;

  public isLoadingResults = false;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetProductionOrderGet: string = "/ProductionOrder/Get/";
  displayedColumns = [
    "deliveryDate",
    "productionOrderNo",
    "madeTo",
    "orderLength",
    "status"
  ];



  constructor(
    public dialogRef: MatDialogRef<ProductionOrderListingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataProductionOrder: any,
    private brokerAPIService: BrokerAPIService,
    private router: Router,
  ) {}

  ngOnInit() { 
    this.isLoadingResults = true;
    this.dataSource.data = this.dataProductionOrder.orderDetail;
    this.isLoadingResults = false;
  }

  formControl = new FormControl("", [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError("required") ? "Required field" : "";
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    if (this.strDialogStatus == "Edit") {
      this.dataProductionOrder.process = this.arrobjProcess.find(
        x => x.id === this.intOldProcessID
      );
      this.dataProductionOrder.product = this.arrobjProduct.find(
        x => x.id === this.intOldProductID
      );
      this.dataProductionOrder.rawmaterialName = this.strOldRawMaterial;
    }

    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataProductionOrder.process = this.arrobjProcess.find(
      x => x.id === this.dataProductionOrder.process.id
    );
    console.log(this.dataProductionOrder);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  rowClicked(row: any): void {
    console.log(this.Url_Detail+row.id);
    this.router.navigate([this.Url_Detail,row.productionOrderId]);
    this.dialogRef.close();
  }

}
