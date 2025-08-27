import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from "./features/shared/components/snackbar/snackbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'fichas-frontend-2.0';

  deferredPrompt: any = null;

  installAvailable = signal<boolean>(false);
  showInstallSheet = signal<boolean>(false);

  constructor() {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      if (!this.isMobile()) {
        return;
      }
      event.preventDefault();
      this.deferredPrompt = event;
      this.installAvailable.set(true);
      this.showInstallSheet.set(true);
    });
  }

  installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ Usuario instaló la app');
      } else {
        console.log('❌ Usuario canceló');
      }
      this.deferredPrompt = null;
      this.installAvailable.set(false);
      this.showInstallSheet.set(false);
    });
  }

  closeSheet() {
    this.showInstallSheet.set(false);
  }

  isMobile(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
}
