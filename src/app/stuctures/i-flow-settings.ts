import { IFlowState } from "./i-flow-state";
import { INavigationBar } from "./i-navigation-bar";
import { IScreenSettingsBase  } from "./screens/i-screen-settings-base";

export interface IFlowSettings{
    persistentFlowItems: Record<string, unknown>;
    flowState: IFlowState;
    navigationBar: INavigationBar;
    screenSettings: IScreenSettingsBase;
}