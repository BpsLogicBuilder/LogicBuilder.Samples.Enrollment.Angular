import { TargetModuleType } from "../i-target-module-type";

export interface INavBarRequest {
    persistentFlowItems?: Record<string, unknown>;
    initialModuleName: string;
    targetModule: TargetModuleType;
}