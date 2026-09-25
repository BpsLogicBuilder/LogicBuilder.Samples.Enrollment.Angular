import { Service, inject } from '@angular/core';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { ProgressService } from '../common/progress.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataSourceRequestState, toDataSourceRequest, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { IGridRequestDetails } from '../stuctures/screens/i-request-details';
import { IGridResult } from '../stuctures/screens/grid/i-grid-result';
import { KendoGridDataRequest } from '../stuctures/screens/kendo-grid-data-request';
import { tap, map, catchError } from 'rxjs/operators';
import { UrlsService } from '../http/urls.service'

@Service()
export class GridService {
    constructor()
    {
        this.baseUrl = this._urls.gridUrl;
    }

    private readonly _http = inject(HttpClient);
    private readonly progressService = inject(ProgressService);
    private readonly _urls = inject(UrlsService);
    private readonly baseUrl: string;

    public fetch(state: DataSourceRequestState, requestDetails: IGridRequestDetails): Observable<IGridResult> {
    const hasGroups = state.group?.length;
    let request: KendoGridDataRequest = {
      options: toDataSourceRequest(state),
      modelType: requestDetails.modelType!,
      dataType: requestDetails.dataType!,
      selectExpandDefinition: requestDetails.selectExpandDefinition
    };

    return this._http
      .post<IGridResult>(`${this.baseUrl}${requestDetails.dataSourceUrl}`, JSON.stringify(request), this.getPostOptions())
      .pipe
      (
      tap(({ data, total, aggregateResults }: any) => {
        // console.log("Data: " + JSON.stringify(data));
        // console.log("Total: " + JSON.stringify(total));
        // console.log("AggregateResults: " + JSON.stringify(aggregateResults));
      }),
      map(({ data, total, aggregateResults }: any) => // process the response
        (<IGridResult>{
          //if there are groups convert them to compatible format
          data: hasGroups ? translateDataSourceResultGroups(data) : data,
          total: total,
          aggregateResult: this.progressService.translateAggregateResults(aggregateResults)
        })),
      catchError(this.handleError)
      );
  }

  private getPostOptions() : { [key: string]: HttpHeaders } {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  private handleError(error: Response) {
    return observableThrowError(() => new Error(JSON.stringify(error) || 'Server error'));
  }
}
