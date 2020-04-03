
export interface ISysMenu {
    id: number;
    menuLevel: number;
    menuOrder: string;
    menusName: string;
    parentMenu: number;
    execURL: string;
    rolesLevel: number;
    createBy: string;
    createDate: Date;
    updateBy: string;
    updateDate: Date;
    inActivated: boolean;
}

export interface ISubMenu {
    name: string;
    link: string;
    icon: string;
    chip: boolean;
    open: boolean;
}

export interface IMenu {
    name: string;
    icon: string;
    link: boolean;
    open: boolean;
    sub: ISubMenu[];
}
