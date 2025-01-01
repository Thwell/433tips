"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/manualPayment.module.css";

export default function ManualPayment() {
  const searchParams = useSearchParams();

  const [paymentDetails, setPaymentDetails] = useState(null);
  const countryCode = searchParams.get("country") || "";
  const price = searchParams.get("price") || "";

  useEffect(() => {
    const getPaymentDetails = () => {
      const africanPayments = {
        ke: {
          currency: "KSH",
          method: "MPESA",
          name: "Thwell Gichovi",
          phone: "0703-147-237",
          description: "Send payment via MPESA",
        },
        ng: {
          currency: "Naira",
          method: "Bank Transfer",
          name: "Mboutidem akpan",
          phone: "3087875918",
          description: "Send payment via FirstBank",
        },
        gh: {
          currency: "Cedis",
          method: "MOMO",
          name: "David Agyevi",
          phone: "0594577146",
          description: "Send payment via Mobile Money(MOMO)",
        },
        tz: {
          currency: "TZS",
          method: "M-PESA Tanzania",
          name: "Thwell Gichovi",
          phone: "0703-147-237",
          description: "Send payment via M-PESA Tanzania",
        },
        ug: {
          currency: "UGX",
          method: "Mobile Money",
          name: "Thwell Gichovi",
          phone: "0703-147-237",
          description: "Dial *165# or via mpesa",
        },
        sa: {
          currency: "ZAR",
          method: "Mobile Money",
          name: "Thwell Gichovi",
          phone: "0743-247-861",
          description: "Send payment via Mobile Money",
        },
        zm: {
          currency: "ZMW",
          method: "Airtel Money",
          name: "John",
          phone: "(+254)783-719-791",
          description: "*778# or use Airtel money mobile app",
        },
        cm: {
          currency: "XAF",
          method: "Mobile Money",
          name: "Thwell Gichovi",
          phone: "237-678-832-736",
          description: "Send payment via Mobile Money",
        },
        za: {
          currency: "ZAR",
          method: "Bank Transfer",
          name: "Thwell Gichovi",
          phone: "0743247861",
          description: "Send payment via Bank Transfer",
        },
        rw: {
          currency: "RWF",
          method: "Mtn line to mpesa kenya",
          name: "Thwell Gichovi",
          phone: "(+254)-703-147-237",
          description: "Dial *830# to send payment via your mtn line to kenya",
        },
        mw: {
          currency: "MWK",
          method: "Airtel Money",
          name: "Thwell Gichovi",
          phone: "(+254)783-719-791",
          description: "Use Airtel money mobile app, select international transfer and choose kenya",
        },
      };

      const defaultPayment = {
        currency: "USD",
        methods: [
          {
            name: "SKRILL",
            contactName: "Thwell Mugambi",
            contactInfo: "betsmart.inc@gmail.com",
            description: "Pay via Skrill",
          },
          {
            name: "PAYPAL",
            contactName: "Leah Nyambura",
            contactInfo: "leahnyambura710@gmail.com",
            description: "Send payment via PayPal",
          },
          {
            name: "BITCOIN",
            contactName: "Thwell Mugambi",
            contactInfo: "bc1qvzny5ffjym462y35qw7qqr6ucgtkcqcu402dl5",
            description: "Send payment via Bitcoin",
          },
          {
            name: "NETELLER",
            contactName: "Manuel",
            contactInfo: "manuumedjs@gmail.com",
            description: "Send payment via Neteller",
          },
        ],
      };

      return africanPayments[countryCode] || defaultPayment;
    };

    setPaymentDetails(getPaymentDetails());
  }, [countryCode]);

  if (!paymentDetails) return null;

  return (
    <div className={styles.manualContainer}>
      <h3>Manual Payment</h3>

      {paymentDetails.methods ? (
        <>
          {paymentDetails.methods.map((method, index) => (
            <div key={index} className={styles.methodItem}>
              <h4 className={styles.methodName}>{method.name}</h4>
              <ul className={styles.instructionsList}>
                <li>
                  Name: <span>{method.contactName}</span>{" "}
                </li>
                <li>
                  Email: <span>{method.contactInfo}</span>{" "}
                </li>
                <li>
                  Amount to pay: <span>{price}</span>{" "}
                </li>
                <li>{method.description}</li>
              </ul>
            </div>
          ))}
        </>
      ) : (
        <ul className={styles.instructionsList}>
          <li>
            Name: <span>{paymentDetails.name}</span>
          </li>
          <li>
            Phone: <span>{paymentDetails.phone}</span>{" "}
          </li>
          <li>
            Amount to pay: <span>{price}</span>{" "}
          </li>
          <li>{paymentDetails.description}</li>
        </ul>
      )}
   
    </div>
  );
}
