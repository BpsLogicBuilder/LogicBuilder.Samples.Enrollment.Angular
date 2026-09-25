import { Component, TemplateRef, ViewChild, input } from '@angular/core';
import { UiNotificationService } from '../common/ui-notification.service';
import { ICommandButton } from '../stuctures/i-command-button';
import { IHtmlPageSettings, IContentTemplate, IMessageTemplate } from '../stuctures/screens/html/i-html-page-settings';
import { ViewTypeEnum } from '../stuctures/screens/i-view-type';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-html-page',
  styleUrl: './html-page.css',
  templateUrl: './html-page.html',
})
export class HtmlPage {
  @ViewChild('welcomeTemplate', { static: true }) welcomeTemplate!: TemplateRef<any>;
  @ViewChild('messageTemplate', { static: true }) messageTemplate!: TemplateRef<any>;

  public settingsInputSignal = input.required<IHtmlPageSettings>(); 
  public commandButtonsInputSignal = input.required<ICommandButton[]>();

  constructor(private readonly _uiNotificationService: UiNotificationService) { }

  public getTemplate(templateName: string) : TemplateRef<any> {
    const templateMap: Record<string, TemplateRef<any>> = {
      'welcomeTemplate': this.welcomeTemplate,
      'messageTemplate': this.messageTemplate
    };

    return templateMap[templateName];
  }

  public getContentContext(contentTemplate: IContentTemplate) {
    return {
      $implicit: contentTemplate
    }
  }

  public getMessageContext(messageTemplate: IMessageTemplate) {
    return {
      $implicit: messageTemplate
    }
  }

  navigateNext(button: ICommandButton) {
    this._uiNotificationService.navigateNext({
      viewType: ViewTypeEnum.Html,
      commandButtonRequest: { newSelection: button.shortString, cancel: button.cancel || false }
    });
  }
}
