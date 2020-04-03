import { startWith } from "rxjs/operators";
export class Validate {
  constructor() {}

  public requireField(objData: any, arrRequireField: Array<string>) {
    let objResult = {
      success: true,
      arrRequireField: [],
      arrHasNotProperty: []
    };
    arrRequireField.forEach(fieldRequire => {
      if (objData.hasOwnProperty(fieldRequire)) {
        if (
          objData[fieldRequire] == "" ||
          objData[fieldRequire] == undefined ||
          objData[fieldRequire] == null
        )
          objResult.arrRequireField.push(fieldRequire);
      } else {
        objResult.success = false;
        objResult.arrHasNotProperty.push(fieldRequire);
      }
    });

    return objResult;
  }
  public requireFieldList(objData: any, arrRequireField: any) {}
}
