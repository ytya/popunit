interface Window {
  gtag(type: 'config', googleAnalyticsId: string): void
  gtag(type: 'event', eventAction: string, fieldObject: { [key: string]: string }): void
}
