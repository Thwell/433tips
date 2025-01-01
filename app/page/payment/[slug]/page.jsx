"use client";

import { toast } from 'sonner';
import Image from "next/image";
import Script from "next/script";
import CardImage from "@/public/assets/card.png";
import AirtelImage from "@/public/assets/airtel.png";
import MpesaImage from "@/public/assets/mpesa.png";
import CountriesData from "@/app/utility/Countries";
import manualImage from "@/public/assets/manual.png";
import SkrillImage from "@/public/assets/skrill.png";
import CoinbaseImage from "@/public/assets/crypto.png";
import PaypalImage from "@/public/assets/paypal.png";
import { useState, useEffect, useCallback } from "react";
import styles from "@/app/styles/paymentmethod.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { MdOutlineLocalPhone as PhoneIcon } from "react-icons/md";

const PAYMENT_CONFIG = {
  AIRTEL_AUTH: process.env.NEXT_PUBLIC_AIRTEL_AUTH,
  AIRTEL_PIN: process.env.NEXT_PUBLIC_AIRTEL_PIN,
  AIRTEL_CLIENT_SECRET: process.env.NEXT_PUBLIC_AIRTEL_CLIENT_SECRET,
  AIRTEL_URL: process.env.NEXT_PUBLIC_AIRTEL_URL,
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID_PAYPAL,
  COINBASE_KEY: process.env.NEXT_PUBLIC_COINBASE_KEY,
  PAYSTACK_KEY: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,
};

const getTokenAirtel = () => {
  const { AIRTEL_AUTH, AIRTEL_CLIENT_SECRET, AIRTEL_URL } = PAYMENT_CONFIG;
  return fetch(`${AIRTEL_URL}/auth/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: AIRTEL_AUTH,
      client_secret: AIRTEL_CLIENT_SECRET,
      grant_type: "client_credentials",
s    }),
  });
}

const AFRICAN_COUNTRIES = CountriesData.filter((country) => [
  "KE",
  "NG",
  "CM",
  "GH",
  "ZA",
  "TZ",
  "UG",
  "ZM",
  "RW",
  "MW",
]).map((country) => country.code.toLowerCase());

export default function PaymentMethods({ params }) {
  const [paymentState, setPaymentState] = useState({
    isPaid: false,
    isCancel: false,
    status: "",
    result: null,
  });
  const [errors, setErrors] = useState({});
  const [customerId, setCustomerId] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = decodeURIComponent(params.slug || "");
  const currentCountry = slug?.trim().toLowerCase() || "";
  const selectedPrice = searchParams.get("price") || "";
  const selectedPlan = searchParams.get("plan") || "";
  const selectedCurrency = searchParams.get("currency") || "";

  const getCountryCode = (countryName) => {
    const country = CountriesData.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.code.toLowerCase() : null;
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.startsWith("254")) {
      return phoneNumber.slice(0, 12);
    } else if (phoneNumber.startsWith("0")) {
      return `254${phoneNumber.slice(1)}`.slice(0, 12);
    } else if (phoneNumber.startsWith("7")) {
      return `254${phoneNumber}`.slice(0, 12);
    }
    return `254${phoneNumber}`.slice(0, 12);
  };

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phoneNumber: formattedPhoneNumber }));
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^2547\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in the format 2547xxxxxxxx";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [showMethods, setShowMethods] = useState({
    mpesa: false,
    coinbase: false,
    paypal: false,
    stripe: false,
    manual: false,
    skrill: false,
    airtel: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomerId(localStorage.getItem("id") || null);
    }
  }, []);

  useEffect(() => {
    if (currentCountry) {
      const countryCode = getCountryCode(currentCountry);

      setShowMethods({
        mpesa:
          countryCode === "ke" || countryCode === "ug" || countryCode === "tz",
        manual: countryCode !== "other",
        skrill: countryCode === "other",
        airtel:
          countryCode === "ke" || countryCode === "mw" || countryCode === "zm",
        coinbase: countryCode ? true : false,
        stripe: countryCode ? true : false,
        paypal: countryCode ? true : false,
      });
    }
  }, [currentCountry]);

  const addVIPAccess = useCallback(async () => {
    if (!paymentState.isPaid) {
      toast.error("Payment failed");
      return;
    }

    if (!customerId) {
      toast.error("Login or create an account to pay");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const currentDate = new Date();
      const formattedDate = `${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}-${currentDate.getFullYear()}`;
      const account = JSON.parse(localStorage.getItem("account"));

      const response = await fetch(
        `${PAYMENT_CONFIG.SERVER_HOST}/auth/update/${customerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paid: true,
            plan: selectedPlan,
            activationDate: formattedDate,
            days: selectedPlan === "Weekly" ? 7 : 30,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update account");

      account.status = true;
      localStorage.setItem("account", JSON.stringify(account));
      localStorage.setItem("paid", "true");

      toast.success("Payment successful!");
      window.location.href = "https://www.433tips.com/page/vip";
    } catch (err) {
      toast.error("An error occurred while updating your account.");
    }
  }, [paymentState.isPaid, customerId, selectedPlan]);

  const handlePayManually = (countryCode, amount) => {
    router.push(`manual/?country=${countryCode}&price=${amount}`, {
      scroll: false,
    });
  };

  const handleAirtelPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { phoneNumber } = formData;

    const inputBody = {
      subscriber: {
        msisdn: phoneNumber,
      },
      transaction: {
        amount: selectedPrice,
        id: "12968801260",
      },
      additional_info: [
        {
          key: "transactionId",
          value: "12968801260",
        },
      ],
      reference: "vip subscription",
      pin: `${PAYMENT_CONFIG.AIRTEL_PIN}`,
    };

    const headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
      "X-Country": getCountryCode(currentCountry),

      "X-Currency": selectedCurrency,
      Authorization: `Bearer ${PAYMENT_CONFIG.AIRTEL_AUTH}`,
    };

    try {
      const response = await axios.post(
        `${PAYMENT_CONFIG.AIRTEL_URL}`,
        inputBody,
        {
          headers,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStripeCheckout = () => {
    const checkoutUrl =
      selectedPlan === "Weekly"
        ? "https://buy.stripe.com/"
        : "https://buy.stripe.com/";
    window.open(checkoutUrl, "_blank");
    addVIPAccess();
  };

  const handleMpesaPayment = () => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Login or create an account to pay");
      return;
    }

    const PaystackPop = require("@paystack/inline-js");
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: PAYMENT_CONFIG.PAYSTACK_KEY,
      email,
      amount: Number(selectedPrice) * 100,
      currency: selectedCurrency,
      ref: `ref_${Math.floor(Math.random() * 1000000000 + 1)}`,
      callback: (response) => {
        if (response.status === "success") {
          setPaymentState((prev) => ({
            ...prev,
            isPaid: true,
            status: "success",
          }));
          addVIPAccess();
        } else {
          setPaymentState((prev) => ({
            ...prev,
            isCancel: true,
            status: "cancelled",
          }));
          toast.error("Payment failed");
        }
      },
      onClose: () => {
        setPaymentState((prev) => ({
          ...prev,
          isCancel: true,
          status: "cancelled",
        }));
        toast.error("Payment failed");
      },
    });
  };

  const handleCoinbasePayment = async () => {
    try {
      const response = await fetch(
        "https://api.commerce.coinbase.com/charges/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CC-Api-Key": PAYMENT_CONFIG.COINBASE_KEY,
          },
          body: JSON.stringify({
            name: "Vip subscription",
            description: "Subscribe for vip",
            pricing_type: "fixed_price",
            local_price: {
              amount: selectedPrice,
              currency: selectedCurrency,
            },
            cancel_url: "",
            success_url: "https://www.433tips.com/page/vip",
          }),
        }
      );

      if (!response.ok) throw new Error("Coinbase payment failed");

      const data = await response.json();
      window.location.href = data.data.hosted_url;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    const loadPayPalScript = async () => {
      if (!window.paypal) return;

      try {
        await window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: selectedPrice,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const details = await actions.order.capture();
              setPaymentState((prev) => ({
                ...prev,
                result: details,
                isPaid: true,
                status: "success",
              }));
              addVIPAccess();
            },
            onError: (err) => {
              setPaymentState((prev) => ({
                ...prev,
                isCancel: true,
                status: "error",
              }));
              toast.error("Payment failed");
              console.error("PayPal error:", err);
            },
            onCancel: () => {
              setPaymentState((prev) => ({
                ...prev,
                isCancel: true,
                status: "cancelled",
              }));
              toast.error("Payment failed");
            },
          })
          .render("#paypal-button-container");
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
      }
    };

    if (showMethods.paypal) {
      loadPayPalScript();
    }
  }, [
    currentCountry,
    selectedCurrency,
    selectedPlan,
    selectedPrice,
    showMethods.paypal,
    addVIPAccess,
  ]);

  const PaymentOption = ({ image, alt, onClick, buttonText }) => (
    <div className={styles.payController}>
      <div className={styles.paymentImageWp}>
        <Image
          className={styles.paymentImage}
          src={image}
          alt={alt}
          fill
          sizes="100%"
          objectFit="contain"
          priority={true}
        />
      </div>

      <div className={styles.btnWp}>
        <button type="button" onClick={onClick} className={styles.btnPay}>
          {buttonText}
        </button>
      </div>
    </div>
  );

  const AirtelPayment = ({ image, alt, onClick, buttonText }) => (
    <div className={styles.payController}>
      <div className={styles.paymentImageWp}>
        <Image
          className={styles.paymentImage}
          src={image}
          alt={alt}
          fill
          sizes="100%"
          objectFit="contain"
          priority={true}
        />
      </div>
      <form onSubmit={handleAirtelPayment} className={styles.formContainer}>
        <div className={styles.authInputContainer}>
          {/* Phone Number */}
          <div className={styles.authInput}>
            <PhoneIcon
              className={styles.authIcon}
              alt="Phone icon"
              width={30}
              height={30}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="2547xxxxxxxx"
              maxLength={12}
            />
          </div>
          {errors.phoneNumber && (
            <p className={styles.errorText}>{errors.phoneNumber}</p>
          )}
        </div>

        <div className={styles.btnWp}>
          <button type="submit" onClick={onClick} className={styles.btnPay}>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className={styles.paymentContainer}>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.CLIENT_ID}&currency=USD`}
        strategy="lazyOnload"
      />
      <div className={styles.paymentDivider}>
        <div className={styles.paymentContainerHeader}>
          <h1>Choose your payment method</h1>
        </div>

        <div className={styles.paymentLayout}>
          {showMethods.manual && (
            <div className={styles.payController}>
              <div className={styles.paymentImageWp}>
                <Image
                  className={styles.paymentImage}
                  src={manualImage}
                  alt="manual image"
                  fill
          sizes="100%"
                  objectFit="cover"
                  priority={true}
                />
              </div>
              <h1>Manual payment</h1>
              <p>Manual option is also available</p>
              <button
                onClick={() =>
                  handlePayManually(
                    getCountryCode(currentCountry),
                    selectedPrice.toLowerCase()
                  )
                }
                type="button"
                className={styles.btnPay}
              >
                Pay manually
              </button>
            </div>
          )}

          {showMethods.mpesa && (
            <PaymentOption
              image={MpesaImage}
              alt="mpesa logo"
              onClick={handleMpesaPayment}
              buttonText="Pay Now"
            />
          )}
          {showMethods.airtel && (
            <AirtelPayment
              image={AirtelImage}
              alt="airtel logo"
              onClick={handleAirtelPayment}
              buttonText="Pay Now"
            />
          )}

          {showMethods.stripe && (
            <PaymentOption
              image={CardImage}
              alt="card logo"
              onClick={handleStripeCheckout}
              buttonText="Pay with card"
            />
          )}

          {showMethods.paypal && (
            <div className={styles.payController} id="paypal-button-container">
              <Image
                src={PaypalImage}
                alt="paypal logo"
                width={200}
                height={100}
                className={styles.paymentPaypalImage}
              />
            </div>
          )}
          {showMethods.coinbase && (
            <PaymentOption
              image={CoinbaseImage}
              alt="coinbase logo"
              onClick={handleCoinbasePayment}
              buttonText="Pay with crypto"
            />
          )}

          {showMethods.skrill && (
            <PaymentOption
              image={SkrillImage}
              alt="skrill logo"
              onClick={handlePayManually}
              buttonText="Pay Now"
            />
          )}
        </div>
      </div>

      <div className={styles.questionWrapper}>
        <div className={styles.questionContainer}>
          <h1>Q: How guaranteed are your games?</h1>
          <p>
            <span>Answer:</span> We have a team of top-notch
            well-researched/informed experts that score up to 96% in their
            accuracy rate. You are guaranteed to make substantial profits.
          </p>
        </div>
        <div className={styles.questionContainer}>
          <h1>Q: What happens for failed predictions?</h1>
          <p>
            <span>Answer:</span> Keep in mind that in case of any loss, we will
            add an extra one day FREE as a replacement on your subscription. We
            will keep adding an extra day until you WIN! This is exclusive for
            VIP subscribers ONLY.
          </p>
        </div>
        <div className={styles.questionContainer}>
          <h1>Q: How do I get these daily games sent to me?</h1>
          <p>
            <span>Answer:</span> We post games on our platform{" "}
            <span>
              <a href="https://www.433tips.com/page/vip" target="_blank">
               VIP
              </a>
            </span>
            . You need to log in on the website using your email and password or
            through social accounts to view games.
          </p>
        </div>
        <div className={styles.questionContainer}>
          <h1>Q: Why donimplenting login with google in nextjs no prismat we post results</h1>
          <p>
            <span>Answer:</span> We donimplenting login with google in nextjs no prismat disclose results because fraudsters
            take screenshots and swindle unsuspecting victims.
          </p>
        </div>
      </div>
    </div>
  );
}
