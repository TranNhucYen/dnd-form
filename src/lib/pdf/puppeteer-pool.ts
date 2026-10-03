import 'server-only';
import puppeteer, { type Browser, type ChromeReleaseChannel } from 'puppeteer';

let browserInstance: Browser | null = null;
let isLaunching = false;
let launchPromise: Promise<Browser> | null = null;

/**
 * Lấy hoặc khởi tạo Singleton Browser giúp tái sử dụng instance để in nhanh
 */
export async function getBrowserInstance(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  if (isLaunching && launchPromise) {
    return launchPromise;
  }

  isLaunching = true;
  launchPromise = (async () => {
    try {
      const envChannel = process.env.PUPPETEER_CHANNEL;
      let channel: ChromeReleaseChannel | undefined = 'chrome';

      if (envChannel !== undefined) {
        channel = envChannel ? (envChannel as ChromeReleaseChannel) : undefined;
      }
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;

      browserInstance = await puppeteer.launch({
        headless: true,
        ...(executablePath ? { executablePath } : channel ? { channel } : {}),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--font-render-hinting=medium',
          '--enable-font-antialiasing',
        ],
      });

      browserInstance.once('disconnected', () => {
        browserInstance = null;
      });

      return browserInstance;
    } finally {
      isLaunching = false;
      launchPromise = null;
    }
  })();

  return launchPromise;
}

export async function closeBrowserInstance(): Promise<void> {
  if (browserInstance && browserInstance.connected) {
    try {
      await browserInstance.close();
    }
    catch {
    }
    finally {
      browserInstance = null;
    }
  }
}

// Tự động đóng browser khi dừng tiến trình
if (typeof process !== 'undefined') {
  process.on('SIGINT', () => {
    void closeBrowserInstance();
  });
  process.on('SIGTERM', () => {
    void closeBrowserInstance();
  });
}
