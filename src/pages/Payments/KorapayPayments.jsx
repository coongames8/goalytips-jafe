import KoraPayment from "kora-checkout";
import Swal from "sweetalert2";

const KORAPAY_KEY = "pk_live_ZghNbXRcpysTrZTXntTtU9a1m4ci5Kzg3oMBYeqh";

export default function KorapayPayments({ 
  price, 
  currentUser, 
  currency,
  isProcessing,
  setIsProcessing,
  getSubscriptionPeriod,
  getDisplayPrice,
  handleUpgrade
}) {
  
  // Handle Korapay payment
  const handleKorapayPayment = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const amount = price; // price is already in the correct currency
    const payCurrency = currency === "NGN" ? "NGN" : "KES";
    const paymentOptions = {
      key: KORAPAY_KEY,
      reference: new Date().getTime().toString(),
      amount,
      currency: payCurrency,
      customer: {
        name: currentUser?.email || "Scoredash User",
        email: currentUser?.email || "greencate01@gmail.com",
      },
      onSuccess: () => {
        setIsProcessing(false);
        handleUpgrade();
      },
      onFailed: (err) => {
        setIsProcessing(false);
        Swal.fire({
          title: "Payment Failed",
          text: err?.message || "Korapay payment was not successful. Please try again.",
          icon: "error"
        });
      },
    };
    const payment = new KoraPayment();
    payment.initialize(paymentOptions);
  };

  return (
    <div className="mpesa-payment">
      <h3>
        GET {getSubscriptionPeriod().toUpperCase()} VIP FOR {getDisplayPrice()}
      </h3>
      <button
        onClick={handleKorapayPayment}
        className="paystack-btn"
        disabled={isProcessing}
        style={{
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer"
        }}
      >
        {isProcessing ? "Processing..." : "Pay with Korapay"}
      </button>
    </div>
  );
}