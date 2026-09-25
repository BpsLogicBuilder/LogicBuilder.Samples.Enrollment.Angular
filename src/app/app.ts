import { Component, signal } from '@angular/core';
import { NavBar } from './nav-bar/nav-bar';
import { ScreenHost } from './screen-host/screen-host';

@Component({
  selector: 'app-root',
  imports: [NavBar, ScreenHost],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('enrollment');
}
