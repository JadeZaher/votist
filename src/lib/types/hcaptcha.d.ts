declare global {
  interface Window {
    hcaptcha: {
      render: (container: string | HTMLElement, options: Hcaptcha.RenderOptions) => string;
      reset: (widgetId: string) => void;
    };
    hcaptchaReady: () => void;
  }

  namespace Hcaptcha {
    interface RenderOptions {
      sitekey: string;
      theme?: 'light' | 'dark';
      size?: 'normal' | 'compact';
      tabindex?: number;
      callback: (token: string) => void;
      'error-callback'?: (error: any) => void;
    }
  }
}
