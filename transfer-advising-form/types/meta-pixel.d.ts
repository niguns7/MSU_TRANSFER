// Meta Pixel type declarations
interface Window {
  fbq?: (
    action: 'track' | 'trackCustom' | 'init',
    eventName: string,
    parameters?: Record<string, any>
  ) => void;
  _fbq?: any;
}
