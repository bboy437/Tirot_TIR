import { Component, OnInit,ViewEncapsulation, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { IShiftSchdule } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableDataSource} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  
  selector: 'app-shift-schdule-listing',
  templateUrl: './shift-schdule-listing.component.html',
  styleUrls: ['./shift-schdule-listing.component.scss']
})

export class ShiftSchduleListingComponent implements OnInit, AfterViewInit {
  
    isLoadingResults = true;
    dataSource = new MatTableDataSource();
    displayedColumns = ['shiftNo', 'shiftName', 'startShiftHour', 'endShiftHour'];
    
    objRowSelected: IShiftSchdule;
    filter:string="";

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private UrlAPI_GetAll : string = "ShiftSchedule/GetAll";
    private Url_Detail : string = "/auth/master/shift-schdule-detail";


 
    constructor(private brokerAPIService: BrokerAPIService,
      private router: Router,
      private route: ActivatedRoute,) { 

    }

  
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
      this.objRowSelected = <IShiftSchdule>row;
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
      this.dataSource.filterPredicate = function(data: IShiftSchdule, filter: string): boolean {
        return (
          data.shiftNo.toString().toLowerCase().includes(filter) ||
          data.shiftName.toString().toLowerCase().includes(filter) ||
          (("0" +  data.startShiftHour).slice(-2) + ":" + ("0" +  data.startShiftMinute).slice(-2)).toLowerCase().includes(filter) ||
          (("0" +  data.endShiftHour).slice(-2)+ ":" + ("0" +  data.endShiftMinute).slice(-2)).toLowerCase().includes(filter)
        );
    };
    }
} 



