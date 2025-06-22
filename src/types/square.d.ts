// Square Web Payments SDK Types
declare global {
  interface Window {
    Square?: {
      payments: (applicationId: string, locationId?: string) => {
        card: () => Promise<{
          attach: (elementId: string) => Promise<void>;
          tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: any[];
          }>;
        }>;
        applePay: () => Promise<any>;
        googlePay: () => Promise<any>;
      };
    };
  }
}

export {};
