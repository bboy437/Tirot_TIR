import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { DataSource } from '@angular/cdk/collections';
import { ISysRole } from '../../interfaces/productionrecords';
import {
    MatSort,
    MatPaginator,
    MatTableModule,
    MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sysrole-listing',
  templateUrl: './sysrole-listing.component.html',
  styleUrls: ['./sysrole-listing.component.scss']
})
export class SysRoleListingComponent implements OnInit {
    isLoadingResults = true;
  dataSource = new MatTableDataSource();
  displayedColumns = ['rolesName', 'rolesLevel', 'inActivated'];
  sysrole: ISysRole;
  sysroleList: ISysRole[];
  objRowSelected: ISysRole;
  filter:string = "" ;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetAll : string = "SysRole/GetAll";
  private Url_Detail : string = "/auth/master/sysrole-detail";
  
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
    this.objRowSelected = <ISysRole>row;
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
    this.dataSource.filterPredicate = function(data: ISysRole, filter: string): boolean {
        return (
          data.rolesName.toString().toLowerCase().includes(filter) ||
          data.rolesLevel.toString().toLowerCase().includes(filter) ||
          data.inActivated.toString().replace("true","Inactive").replace("false","Active").toLowerCase().includes(filter)
        );
    };
}
}