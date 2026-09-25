import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericGrid } from './generic-grid';
import { IGridSettings } from '../../stuctures/screens/grid/i-grid-settings';
import { ICommandButton } from '../../stuctures/i-command-button';
import { GridService } from '../../http/grid.service';
import { of } from 'rxjs';

describe('GenericGrid', () => {
  let component: GenericGrid;
  let fixture: ComponentFixture<GenericGrid>;

   const mockGridService = {
      fetch: vi.fn().mockReturnValue(of({ data: [], total: 0, aggregateResult: undefined })),
    };

  const mockSettings: IGridSettings = {
      title: "Grid",
      sortable: true,
      pageable: true, 
      scrollable: 'scrollable', 
      groupable: true, 
      filterable: true, 
      columns: [],
      gridId: 0,
      state: {
        skip: 0,
        take: 10,
        filterGroup: { logic: 'and', filters: [] }
      },
      aggregates: []
    };
  
  const mockCommandButtons: ICommandButton[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericGrid],
      providers: [
        { provide: GridService, useValue: mockGridService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settingsInputSignal', mockSettings);
    fixture.componentRef.setInput('commandButtonsInputSignal', mockCommandButtons);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
