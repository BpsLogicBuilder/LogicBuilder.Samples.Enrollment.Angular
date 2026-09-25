import { TestBed } from '@angular/core/testing';
import { UiNotificationService } from './ui-notification.service';

describe('UiNotificationService', () => {
  let service: UiNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
