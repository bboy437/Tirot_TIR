import { Component, OnInit,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { IOperationInstruction, IProcess, IProduct } from '../../../../interfaces/productionrecords';
import { BrokerAPIService } from '../../../../services/brokerapi.service';


@Component({
  selector: 'article-add-dialog',
  templateUrl: './article-dialog.component.html',
  styleUrls: ['./article-dialog.component.scss']
})
export class ArticleDialogComponent implements OnInit {

  private UrlAPI_GetAllProcess: string = "Process/GetAll";
  private UrlAPI_GetRawMaterialAndWIP: string = "RawMaterial/GetRawMaterialAndWIP";
  private UrlAPI_GetAllProduct: string = "Product/GetAll";

  arrobjProcess: any = [];
  arrobjRawMaterial: any = [];
  arrobjProduct: any = [];
  processSelected: any = {};

  private intOldProcessID : number;
  public intProcessID : number;
  private strOldRawMaterial : string;
  public intProductID : number;
  private intOldProductID : number;
  public strDialogStatus : string;
  
  constructor(public dialogRefArticle: MatDialogRef<ArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataOperationInstruction: IOperationInstruction ,
    private brokerAPIService: BrokerAPIService
  ) { }

  ngOnInit() {
    this.setSelectProcess();
    this.setSelectRawMaterial();
    this.setSelectProduct();

    console.log(this.dataOperationInstruction);
    if(this.dataOperationInstruction == null)
    {
      this.strDialogStatus = "Add";
      this.dataOperationInstruction = <IOperationInstruction> {};
     
      this.dataOperationInstruction.createBy="admin";
      this.dataOperationInstruction.rawmaterialName = "";
      this.dataOperationInstruction.updateBy="admin";
      this.dataOperationInstruction.usingStandard=(null);
      this.dataOperationInstruction.id= (null);

      this.dataOperationInstruction.process  = <IProcess> {};
      this.dataOperationInstruction.process.id = (null);

      this.dataOperationInstruction.product  = <IProduct> {};
      this.dataOperationInstruction.product.id = (null);
   
      console.log("ngOnInit");
      console.log(this.dataOperationInstruction);
    }
    else
    {
      this.strDialogStatus = "Edit";
      this.intOldProcessID = this.dataOperationInstruction.process.id;
      this.intProcessID = this.dataOperationInstruction.process.id;
      this.strOldRawMaterial = this.dataOperationInstruction.rawmaterialName;
      this.intOldProductID = this.dataOperationInstruction.product.id;
      this.intProductID = this.dataOperationInstruction.product.id;
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
    if(this.strDialogStatus == "Edit")
    {
      this.dataOperationInstruction.process = this.arrobjProcess.find(x => x.id === this.intOldProcessID);
      this.dataOperationInstruction.product = this.arrobjProduct.find(x => x.id === this.intOldProductID);
      this.dataOperationInstruction.rawmaterialName = this.strOldRawMaterial;
    }

    this.dialogRefArticle.close();

  }

  public confirmAdd(): void {

    this.dataOperationInstruction.process = this.arrobjProcess.find(x => x.id === this.dataOperationInstruction.process.id);
    console.log(this.dataOperationInstruction);

  }


  setSelectProcess() {
    this.brokerAPIService.get(this.UrlAPI_GetAllProcess).subscribe(
      data => {
        this.arrobjProcess = <IProcess[]>data;

      }
    );
  }

  setSelectRawMaterial() {
    this.brokerAPIService.get(this.UrlAPI_GetRawMaterialAndWIP).subscribe(
      data => {
        this.arrobjRawMaterial = data;
      }
    );
  }

  setSelectProduct() {
    this.brokerAPIService.get(this.UrlAPI_GetAllProduct).subscribe(
      data => {
        this.arrobjProduct = data;
      }
    );
  }

  ddlProcess_SelectIndexChange(data){
    this.dataOperationInstruction.process = this.arrobjProcess.find(x => x.id === data);
  }

  ddlProduct_SelectIndexChange(data){
     this.dataOperationInstruction.product = this.arrobjProduct.find(x => x.id === data);
   }

}
