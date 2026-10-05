import { TestBed } from '@angular/core/testing';
import { SignalR } from './signal-r';
import { UrlsService } from './urls.service';

describe('SignalR', () => {
  let service: SignalR;

  let mockUrlService = {
    crudUrl: 'http://localhost',
    gridUrl: 'http://localhost',
    workflowUrl: 'http://localhost',
    chatHubUrl: 'http://localhost'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SignalR, useClass: SignalR }, 
        { provide: UrlsService, useValue: mockUrlService }
      ]
    });
    service = TestBed.inject(SignalR);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
