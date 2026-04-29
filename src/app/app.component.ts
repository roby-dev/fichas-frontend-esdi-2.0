import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from "./features/shared/components/snackbar/snackbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnackbarComponent],
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
      if (!this.isMobile() || this.isInstalled()) return;
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

  isInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  isMobile(): boolean {
    const ua = navigator.userAgent;
    const hasTouchScreen = navigator.maxTouchPoints > 0;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      ua
    );
    return hasTouchScreen && isMobileUserAgent;
  }
}
