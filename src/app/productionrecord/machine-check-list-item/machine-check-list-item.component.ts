import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ICheckList } from '../../interfaces/productionrecords';

@Component({
  selector: 'app-machine-check-list-item',
  templateUrl: './machine-check-list-item.component.html',
  styleUrls: ['./machine-check-list-item.component.scss']
})
export class MachineCheckListItemComponent implements OnInit {

  @Input() objMachineCheckList: any = {};
  @Input() PlanStatus: any;

  btnOKNG_Disabled: boolean;

  constructor() { }


  ngOnInit() {
    //console.log(this.objMachineCheckList);
    switch (this.PlanStatus) {
      case null:
      case "0": //Not Start
        this.btnOKNG_Disabled = false;
        break;
      case "1": //Running
      case "2": //Head Finish
      case "3": //Finished
      case "7": //Cancel
        this.btnOKNG_Disabled = true;
        break;
      default:

        break;
    }

  }

  keyPressCol1(event: any) {
    this.checkOKNG1(event);
  }

  keyPressCol2(event: any) {
    this.checkOKNG2(event);
  }

  checkOKNG1(input: number) {
    try {
      if (this.objMachineCheckList.stdMaxValue1 < input || this.objMachineCheckList.stdMinValue1 > input) {
        //  console.log(this.objMachineCheckList);
        this.objMachineCheckList.col1OkNg = "NG";
      }
      else {
        this.objMachineCheckList.col1OkNg = "OK";
      }
    } catch (error) {
      console.log(error);
    }
  }

  checkOKNG2(input: number) {
    try {
      if (this.objMachineCheckList.stdMaxValue2 < input || this.objMachineCheckList.stdMinValue2 > input) {
        //  console.log(this.objMachineCheckList);
        this.objMachineCheckList.col2OkNg = "NG";
      }
      else {
        this.objMachineCheckList.col2OkNg = "OK";
      }
    } catch (error) {
      console.log(error);
    }
  }


  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  keydecimal(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/g;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
