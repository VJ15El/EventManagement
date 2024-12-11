import { Registration } from '../types/registration';
import { PaymentResponse } from '../types/payment';
import { useRegistrationStore } from '../store/registrationStore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Error loading Razorpay script:', error);
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

export const processPayment = async (registration: Registration): Promise<PaymentResponse> => {
  try {
    console.log('Initializing Razorpay...');
    const res = await initializeRazorpay();

    if (!res) {
      return {
        success: false,
        transactionId: '',
        amount: registration.totalPrice,
        timestamp: new Date().toISOString(),
        error: 'Payment system is currently unavailable'
      };
    }

    const orderData = {
      amount: Math.round(registration.totalPrice * 100),
      currency: "INR",
      receipt: `receipt_${registration.id}`,
      notes: {
        registrationId: registration.id,
        eventId: registration.eventId,
      }
    };

    return new Promise((resolve) => {
      const options = {
        key: "rzp_test_PH9aE9QDtwm6JQ",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "EventHub",
        description: `Payment for Event Registration`,
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        order_id: undefined,
        handler: function (response: any) {
          const paymentResponse: PaymentResponse = {
            success: true,
            transactionId: response.razorpay_payment_id,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: registration.totalPrice,
            timestamp: new Date().toISOString()
          };

          // Update registration status
          const { updateRegistrationPaymentStatus } = useRegistrationStore.getState();
          updateRegistrationPaymentStatus(registration.id, {
            status: 'paid',
            lastUpdated: new Date().toISOString(),
            transactionDetails: {
              transactionId: response.razorpay_payment_id,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: registration.totalPrice,
              timestamp: new Date().toISOString()
            }
          });

          resolve(paymentResponse);
        },
        prefill: {
          name: registration.attendeeInfo.name,
          email: registration.attendeeInfo.email,
          contact: registration.attendeeInfo.phone,
        },
        notes: orderData.notes,
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function() {
            const { updateRegistrationPaymentStatus } = useRegistrationStore.getState();
            updateRegistrationPaymentStatus(registration.id, {
              status: 'pending',
              lastUpdated: new Date().toISOString(),
              error: 'Payment cancelled by user'
            });

            resolve({
              success: false,
              transactionId: '',
              amount: registration.totalPrice,
              timestamp: new Date().toISOString(),
              error: 'Payment cancelled by user'
            });
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        const { updateRegistrationPaymentStatus } = useRegistrationStore.getState();
        updateRegistrationPaymentStatus(registration.id, {
          status: 'failed',
          lastUpdated: new Date().toISOString(),
          error: response.error.description,
          transactionDetails: {
            transactionId: response.error.metadata.payment_id,
            paymentId: response.error.metadata.payment_id,
            orderId: response.error.metadata.order_id,
            amount: registration.totalPrice,
            timestamp: new Date().toISOString()
          }
        });

        resolve({
          success: false,
          transactionId: response.error.metadata.payment_id,
          amount: registration.totalPrice,
          timestamp: new Date().toISOString(),
          error: response.error.description
        });
      });

      paymentObject.open();
    });
  } catch (error) {
    const { updateRegistrationPaymentStatus } = useRegistrationStore.getState();
    updateRegistrationPaymentStatus(registration.id, {
      status: 'failed',
      lastUpdated: new Date().toISOString(),
      error: 'An unexpected error occurred'
    });

    return {
      success: false,
      transactionId: '',
      amount: registration.totalPrice,
      timestamp: new Date().toISOString(),
      error: 'An unexpected error occurred'
    };
  }
};