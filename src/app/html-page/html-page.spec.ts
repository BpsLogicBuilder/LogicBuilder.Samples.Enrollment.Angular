import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HtmlPage } from './html-page';
import { IHtmlPageSettings } from '../stuctures/screens/html/i-html-page-settings';
import { ICommandButton } from '../stuctures/i-command-button';

describe('HtmlPage', () => {
  let component: HtmlPage; 
  let fixture: ComponentFixture<HtmlPage>;

  const mockSettings: IHtmlPageSettings = {
  };

  const mockCommandButtons: ICommandButton[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settingsInputSignal', mockSettings);
    fixture.componentRef.setInput('commandButtonsInputSignal', mockCommandButtons);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
