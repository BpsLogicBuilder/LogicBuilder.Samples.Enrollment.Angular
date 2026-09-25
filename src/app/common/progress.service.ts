import { Service } from '@angular/core';
import { AggregateResult } from '@progress/kendo-data-query';

@Service()
export class ProgressService {
  private set(field: string, target: Record<string, unknown>, value: any) {
    target[field] = value;
    return target;
  }

  public translateAggregateResults(data: any[]): AggregateResult {
    return (
      (data || []).reduce((acc, x) => this.set(x.Member || x.member, acc, this.set((x.AggregateMethodName || x.aggregateMethodName).toLowerCase(), acc[x.Member || x.member] || {}, x.Value || x.value)), {})
    );
  }
}
