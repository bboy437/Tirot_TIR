import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { IRawMaterial } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import {
    MatSort,
    MatPaginator,
    MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-raw-material-listing',
  templateUrl: './raw-material-listing.component.html',
  styleUrls: ['./raw-material-listing.component.scss']
})
export class RawMaterialListingComponent implements OnInit, AfterViewInit {

  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource();
    displayedColumns = ['rawMaterialCode', 'rawMaterialName', 'inActivated'];
    objRowSelected: IRawMaterial;
    filter:string="";

    private UrlAPI_GetAll: string = "RawMaterial/GetAll";
    private Url_Detail: string = "/auth/master/raw-material-detail";


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

  btnNewClick() {
    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <IRawMaterial>row;
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
    this.dataSource.filterPredicate = function(data: IRawMaterial, filter: string): boolean {
      return (
        data.rawMaterialCode.toString().toLowerCase().includes(filter) ||
        data.rawMaterialName.toString().toLowerCase().includes(filter) ||
        data.inActivated.toString().replace("true","Inactive").replace("false","Active").toLowerCase().includes(filter)
      );
  };
  }

}
