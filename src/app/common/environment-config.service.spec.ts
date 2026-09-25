import { TestBed } from '@angular/core/testing';
import { EnvironmentConfigService } from './environment-config.service';

describe('EnvironmentConfigService', () => {
  let service: EnvironmentConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
