//Products
export interface IProduct {
    id: number;
    productCode: string;
    productName: string;
    productType: string;
    bgColor: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
  
}

//RawMaterial
export interface IRawMaterial {
    id: number;
    rawMaterialCode: string;
    rawMaterialName: string;
    rawMaterialType: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//Article
export interface IArticle {
    id: number;
    articleName: string;
    useForProductId: number;
    operationInstruction: IOperationInstruction[];
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//Process
export interface IProcess {
    id: number;
    processCode: string;
    processName: string;
    processType: string;
    defaultStandard: string;
    defaultMessage: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}



export interface IOperationInstruction {
    id: number;
    process: IProcess;
    rawmaterialName: string;
    product: IProduct;
    usingStandard: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

//ShiftSchdule
export interface IShiftSchdule {
    id: number;
    shiftNo: number;
    shiftName: string;
    startShiftDay: number;
    startShiftHour: number;
    startShiftMinute: number;
    endShiftDay: number;
    endShiftHour: number;
    endShiftMinute: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

//Customer
export interface ICustomer {
    id: number;
    customerCode: string;
    customerName: string;
    customerShortName: string;
    address1: string;
    address2: string;
    contractPerson: string;
    phoneNo: string;
    faxNo: string;
    emailAddress: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//Team
export interface ITeam {
    id: number;
    teamName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//Station
export interface InStationGroup {
    id: number;
    stationGroupName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IStation {
    id: number;
    stationName: string;
    stationGroupId: number;
    inStationGroup: InStationGroup;
    machineId: number;
    inMachine: InMachine;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface InMachine {
    id: number;
    machineName: string;
    machineModel: string;
    machineLocation: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

// StationGroup
export interface IStationGroup {
    id: number;
    stationGroupName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//SysRole
export interface ISysRole {
    id: number;
    rolesName: string;
    rolesLevel: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

//ProductionOrder
export interface IProductionOrder {
	productCode: string;
	productName: string;
	orderQty: number;
	fgQty: number;
	deliveryQty: number;
	deliveryMonth: number;
	deliveryYear: number;
	productId: number;
	orderDetail: any[];
}

export interface ICustomerOrder {
	id: number;
	customerCode: string;
	customerName: string;
	customerShortName: string;
	address1: string;
	address2: string;
	contractPerson: string;
	phoneNo: string;
	faxNo: string;
	emailAddress: string;
	createBy: string;
	createDate: string;
	updateBy: string;
	updateDate: string;
	inActivated: boolean;
}

export interface IOrderItem {
	id: number;
	itemNo: number;
	productionOrderId: number;
	productId: number;
	product: IProduct;
	status: string;
	orderQty: number;
	createBy: string;
	createDate: string;
	updateBy: string;
	updateDate: string;
}

export interface IProductionOrder {
	id: number;
	productionOrderNo: string;
	productionOrderDate: string;
	status: string;
	madeTo: string;
	customerOrderId: number;
	customerOrder: ICustomerOrder;
	cutomerOrderDate: string;
	deliveryDate: string;
	remark: string;
	orderItems: IOrderItem[];
	createBy: string;
	createDate: string;
	updateBy: string;
	updateDate: string;
}


export interface IProductionPlanByMonthAndShift {
	id: number;
	planDate: string;
	planStartTime: string;
	caption: string;
	bgColor: string;
}

export interface IDefect {
    id: number;
    defectCode: string;
    defectName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IGrade {
    id: number;
    gradeName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface IUom {
    id: number;
    uomName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface ICheckListItem {
    id: number;
    processId: number;
    machineCheckListTemplateId: number;
    machineId: number;
    groupOrder: number;
    lineOrder: number;
    noColumnInLine: number;
    captionCol1: string;
    dataTypeCol1: string;
    captionCol2: string;
    dataTypeCol2: string;
    stdMinValue1: number;
    stdMaxValue1: number;
    stdMinValue2: number;
    stdMaxValue2: number;
    checkSelected: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface ICheckList {
    id: number;
    prMachineCheckListId: number;
    machineCheckListProcessId: number;
    checkListItem: ICheckListItem;
    groupOrder: number;
    lineOrder: number;
    noColumnInLine: number;
    captionCol1: string;
    dataTypeCol1: string;
    captionCol2: string;
    dataTypeCol2: string;
    col1Value: number;
    col1OkNg: boolean;
    col2Value: number;
    col2OkNg: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface IMachineCheckList {
    id: number;
    productionRecordId: number;
    checkListNo: string;
    checkBy: string;
    checkDateTime: Date;
    reviewBy: string;
    reviewDateTime: Date;
    checkLists: ICheckList[];
    remark: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}



export interface Product {
    id: number;
    productCode: string;
    productName: string;
    productType: string;
    bgColor: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface Process {
    id: number;
    processCode: string;
    processName: string;
    processType: string;
    defaultStandard: string;
    checkEPCStandard: string;
    checkCleanStandard: string;
    defaultMessage: string;
    machineRunningSpeed: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface Shift {
    id: number;
    shiftNo: number;
    shiftHour: number;
    shiftName: string;
    startShiftDay: number;
    startShiftHour: number;
    startShiftMinute: number;
    endShiftDay: number;
    endShiftHour: number;
    endShiftMinute: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface WokingTeam {
    id: number;
    teamName: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface ProductionPlan {
    id: number;
    planType: string;
    productionOrderNo: string;
    itemNo: number;
    lotNo: number;
    productId: number;
    product: Product;
    jobOrderNo: string;
    planDate: Date;
    rollNo: string;
    processId: number;
    process: Process;
    planQty: number;
    standard: string;
    planStartTime: Date;
    planFinishTime: Date;
    shiftId: number;
    shift: Shift;
    wokingTeamId: number;
    wokingTeam: WokingTeam;
    status: string;
    remark: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface StartOperData {
    id: number;
    productionRecordId: number;
    workerId: number;
    leftWeight: number;
    centerWeight: number;
    rightWeight: number;
    leftThickness: number;
    centerThickness: number;
    rightThickness: number;
    fabricWidth: number;
    fabricLength: number;
    fabricSet: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface MixedSolution {
    id: number;
    productionRecordId: number;
    workerId: number;
    tankNo: string;
    mixingDate: Date;
    solidContext: number;
    referToDDNo: string;
    startUseTime: Date;
    mixedIn: number;
    mixedOut: number;
    vesselWeigth: number;
    referToCNNo: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface StandardInspection {
    id: number;
    productionRecordId: number;
    workerId: number;
    frontLeftWeight: number;
    frontCenterWeight: number;
    frontRightWeight: number;
    frontLeftThickness: number;
    frontCenterThickness: number;
    frontRightThickness: number;
    frontFabricWidth: number;
    frontFabricLength: number;
    frontFabricSet: number;
    frontIsLeftCrease: boolean;
    frontIsSmoothRoll: boolean;
    rearLeftWeight: number;
    rearCenterWeight: number;
    rearRightWeight: number;
    rearLeftThickness: number;
    rearCenterThickness: number;
    rearRightThickness: number;
    rearFabricWidth: number;
    rearFabricLength: number;
    rearFabricSet: number;
    rearIsLeftCrease: boolean;
    rearIsSmoothRoll: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface Defect {
    id: number;
    defectCode: string;
    defectName: string;
    defectNameTH: string;
    defectType: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface InlineInspection {
    id: number;
    productionRecordId: number;
    workerId: number;
    rowNo: number;
    defectAtLength: number;
    defectId: number;
    defect: Defect;
    remark: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface IJobOrder {
    id: number;
    productionPlanId: number;
    productionPlan: ProductionPlan;
    lotNo: number;
    productionRecordStatus: string;
    onMachineId: number;
    teamId: number;
    shiftId: number;
    startProductionTime: Date;
    endProductionTime: Date;
    fabricRollNo: string;
    spindleNo: string;
    remark: string;
    machineCheckListId: number;
    startOperData: StartOperData;
    mixedSolutions: MixedSolution[];
    standardInspection: StandardInspection;
    inlineInspections: InlineInspection[];
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}
export interface IStandardinspect {
    id: number;
    productionRecordId: number;
    workerId: number;
    frontLeftWeight: number;
    frontCenterWeight: number;
    frontRightWeight: number;
    frontLeftThickness: number;
    frontCenterThickness: number;
    frontRightThickness: number;
    frontFabricWidth: number;
    frontFabricLength: number;
    frontFabricSet: number;
    frontIsLeftCrease: boolean;
    frontIsSmoothRoll: boolean;
    rearLeftWeight: number;
    rearCenterWeight: number;
    rearRightWeight: number;
    rearLeftThickness: number;
    rearCenterThickness: number;
    rearRightThickness: number;
    rearFabricWidth: number;
    rearFabricLength: number;
    rearFabricSet: number;
    rearIsLeftCrease: boolean;
    rearIsSmoothRoll: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}



export interface FinalInspection {
    id: number;
    productionPlanId: number;
    productionPlan: ProductionPlan;
    lotNo: number;
    productionRecordStatus: string;
    onMachineId: number;
    teamId: number;
    shiftId: number;
    startProductionTime: Date;
    endProductionTime: Date;
    fabricRollNo: string;
    spindleNo: string;
    remark: string;
    machineCheckListId: number;
    startOperData: StartOperData;
    mixedSolutions: MixedSolution[];
    standardInspection: StandardInspection;
    inlineInspections: InlineInspection[];
    machineCheckLists: IMachineCheckList[];
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface AvailableForInspect {
    id: number;
    productionPlanId: number;
    productionPlan: ProductionPlan;
    lotNo: number;
    productionRecordStatus: string;
    onMachineId: number;
    teamId: number;
    shiftId: number;
    startProductionTime: Date;
    endProductionTime: Date;
    productionLength: number;
    fabricRollNo: string;
    spindleNo: string;
    remark: string;
    machineCheckListId: number;
    startOperData: StartOperData;
    mixedSolutions: MixedSolution[];
    standardInspection: StandardInspection;
    inlineInspections: InlineInspection[];
    machineCheckLists: IMachineCheckList[];
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface IProductionRecord {
    id: number;
    productionPlanId: number;
    productionPlan: ProductionPlan;
    lotNo: number;
    productionRecordStatus: string;
    onMachineId: number;
    teamId: number;
    shiftId: number;
    startProductionTime: Date;
    endProductionTime: Date;
    productionLength: number;
    fabricRollNo: string;
    spindleNo: string;
    remark: string;
    machineCheckListId: number;
    startOperData: StartOperData;
    mixedSolutions: MixedSolution[];
    standardInspection: StandardInspection;
    inlineInspections: InlineInspection[];
    machineCheckLists: IMachineCheckList[];
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface IFinishGoodsDetail {
    id: number;
    finalInspectionId: number;
    rollNo: number;
    length: number;
    width: number;
    diameter: number;
    spindleWeight: number;
    totalWeight: number;
    gradeId: number;
    grade: IGrade;
    sampleInLength: number;
    sampleInQty: number;
    remark: string;
    inspectionStatus: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}

export interface IFinishGoods {
    id: number;
    productCode: string;
    productName: string;
    productType: string;
    bgColor: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface ICreateFinalInspection {
    id: number;
    packingNo: string;
    finishGoodsId: number;
    finishGoods: IFinishGoods;
    productionRecordId: number;
    productionRecord: IProductionRecord;
    edgeCut: boolean;
    packerId: number;
    packingDate: Date;
    startWorkTime: Date;
    endWorkTime: Date;
    finishGoodsDetails: IFinishGoodsDetail[];
    inspectionStatus: string;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
}


export interface IProductionRecord_JobOrder_startOperData {
    id: number;
    productionRecordId: number;
    workerId: number;
    leftWeight: number;
    centerWeight: number;
    rightWeight: number;
    leftThickness: number;
    centerThickness: number;
    rightThickness: number;
    fabricWidth: number;
    fabricLength: number;
    fabricSet: number;
    isLeftCrease: boolean;
    isSmoothRoll: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
} 


export interface IProductionRecord_JobOrder_startOperData2 {

    workerId: number;
    leftWeight: number;
    centerWeight: number;
    rightWeight: number;
    leftThickness: number;
    centerThickness: number;
    rightThickness: number;
    fabricWidth: number;
    fabricLength: number;
    fabricSet: number;
    isLeftCrease: boolean;
    isSmoothRoll: boolean;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
} 