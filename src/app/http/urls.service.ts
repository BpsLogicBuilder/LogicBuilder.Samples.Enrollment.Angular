import {inject, Service } from '@angular/core';
import { EnvironmentConfigService } from '../common/environment-config.service';

@Service()
export class UrlsService {
    private readonly _environmentConfigService = inject(EnvironmentConfigService);
    
    constructor() {
        this.crudUrl = this._environmentConfigService.get('CRUD_URL');
        this.gridUrl = this._environmentConfigService.get('GRID_URL');
        this.workflowUrl = this._environmentConfigService.get('WORKFLOW_URL');
        console.log("Environment is: " + this._environmentConfigService.get('ENVIRONMENT_NAME'));
   }

  crudUrl: string;
  gridUrl: string;
  workflowUrl: string;
}
