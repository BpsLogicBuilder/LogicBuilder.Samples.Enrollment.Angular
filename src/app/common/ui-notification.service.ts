import { inject, Service, signal } from '@angular/core';
import { SettingsService } from '../http/settings.service';
import { INavigationBar } from '../stuctures/i-navigation-bar';
import { IScreenSettingsBase } from '../stuctures/screens/i-screen-settings-base';
import { IFlowState } from '../stuctures/i-flow-state';
import { IRequestsBase } from '../stuctures/screens/requests/i-requests-base';
import { INavBarRequest } from '../stuctures/screens/requests/i-nav-bar-request';

@Service()
export class UiNotificationService {

  constructor() { 
    this.persistentFlowItems = {};
  }

  private readonly _settingsService = inject(SettingsService);

  private readonly _navBar = signal<INavigationBar| null>(null);
  public readonly navBar = this._navBar.asReadonly();

  private readonly _screenSettings = signal<IScreenSettingsBase | null>(null);
  public readonly screenSettings = this._screenSettings.asReadonly();
  public flowState?: IFlowState;
  public persistentFlowItems: Record<string, unknown>;
  public errorMessage: any;

  public start(): void {
    this._settingsService.start().subscribe({
      next: itm => {
        this._navBar.set(itm.navigationBar);
        this._screenSettings.set(itm.screenSettings);
        this.flowState = itm.flowState;
        this.persistentFlowItems = itm.persistentFlowItems;
      },
      error: error => this.errorMessage = <any>error})
  }

  public navStart(request: INavBarRequest): void {
    request.persistentFlowItems = this.persistentFlowItems;
    this._settingsService.navStart(request).subscribe({
      next: itm => {
        this._navBar.set(itm.navigationBar);
        this._screenSettings.set(null);
        setTimeout(() => {
          this._screenSettings.set(itm.screenSettings);
        }, 10);
        this.flowState = itm.flowState;
        this.persistentFlowItems = itm.persistentFlowItems;
      },
      error: error => this.errorMessage = <any>error});
  }

  public navigateNext(request: IRequestsBase): void {
    request.persistentFlowItems = this.persistentFlowItems;
    request.flowState = this.flowState;
    this._settingsService.navigateNext(request).subscribe({
      next: itm => {
        this._navBar.set(itm.navigationBar);
        this._screenSettings.set(null);
        setTimeout(() => {
          this._screenSettings.set(itm.screenSettings);
        }, 10);
        this.flowState = itm.flowState;
        this.persistentFlowItems = itm.persistentFlowItems;
      },
      error: error => this.errorMessage = <any>error});
  }
}
