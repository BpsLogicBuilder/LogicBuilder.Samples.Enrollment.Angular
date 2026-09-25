import { ViewTypeEnum } from "./i-view-type";
import { ICommandButton } from "../i-command-button";

export interface IScreenSettingsBase {
    viewType: ViewTypeEnum;
    commandButtons: ICommandButton[];
    [x: string]: any;
}
