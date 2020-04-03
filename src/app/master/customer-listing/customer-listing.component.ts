import { Component, OnInit, ViewEncapsulation, 
  Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { DataSource } from '@angular/cdk/collections';
import { ICustomer } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableModule,
  MatTableDataSource} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.component.html',
  styleUrls: ['./customer-listing.component.scss']
})

export class CustomerListingComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource();
  isLoadingResults = true;
  displayedColumns = ['customerCode', 'customerName', 'customerShortName',  'contractPerson','phoneNo','faxNo','emailAddress'];
  
  objRowSelected: ICustomer;
  filter:string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetAll : string = "Customer/GetAll";
  private Url_Detail : string = "/auth/master/customer-detail";
  
  
  
  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.isLoadingResults = true;
    let params = this.route.snapshot.paramMap;
    this.brokerAPIService.get(this.UrlAPI_GetAll).subscribe(data => {
      this.dataSource.data = data;
      this.isLoadingResults = false;

      if(params.get("filter") != null ){
        this.filter = params.get("filter");
      }
      this.dataSource.filter = this.filter.toLowerCase();
      
    });
  }

  btnCreateClick() {

    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <ICustomer>row;
    this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, filter: this.filter } ]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(data: ICustomer, filter: string): boolean {
      return (
        data.customerCode.toLowerCase().includes(filter) ||
        data.customerName.toLowerCase().includes(filter) ||
        data.customerShortName.toLowerCase().includes(filter) ||
        data.contractPerson.toLowerCase().includes(filter) ||
        data.phoneNo.toLowerCase().includes(filter) ||
        data.faxNo.toLowerCase().includes(filter) ||
        data.emailAddress.toLowerCase().includes(filter)
      );
    };
    
  }

}


