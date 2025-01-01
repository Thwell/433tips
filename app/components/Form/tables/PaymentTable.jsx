"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nothing from "@/app/components/Nothing";
import { GrAdd as AddIcon } from "react-icons/gr";
import { FiEdit as EditIcon } from "react-icons/fi";
import { usePaymentStore } from "@/app/store/Payment";
import Nopayment from "@/public/assets/nopayment.png";
import LoadingLogo from "@/app/components/LoadingLogo";
import styles from "@/app/styles/accounttable.module.css";
import { MdDeleteOutline as DeleteIcon } from "react-icons/md";


export default function DataTable() {
  const router = useRouter();
  const { paymentPlans, loading, error, fetchPaymentPlans, deletePaymentPlan } =
    usePaymentStore();

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchPaymentPlans();
  }, [fetchPaymentPlans]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment plan?")) {
      try {
        const result = await deletePaymentPlan(id);
        if (result.success) {
          toast.success("Payment plan deleted successfully");
          fetchPaymentPlans();
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete payment plan");
      }
    }
  };

  const handleEdit = (id) => {
    setUserId(id);
    router.push(`dashboard/payment?form=Edit&id=${id}`, { scroll: false });
  };

  const addPaymentPlan = () => {
    router.push(`dashboard/payment?form=Add`, { scroll: false });
  };

  const formatCurrency = (amount, currency) => {
    if (amount === 0 || amount === undefined || amount === null) return "N/A";
    return `${amount} ${currency || ""}`;
  };

  if (loading) return <LoadingLogo />;

  return (
    <>
      {paymentPlans.length === 0 ? (
        <Nothing
          Alt="No payment plans available"
          NothingImage={Nopayment}
          Text="No payment plans available"
        />
      ) : (
        <div className={styles.dataContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.addContainer} onClick={addPaymentPlan}>
              <AddIcon aria-label="add payment" className={styles.copyIcon} />
              Add Payment Plan
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.sportsTable}>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Weekly Price</th>
                  <th>Monthly Price</th>
                  <th>Currency</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paymentPlans.map((plan) => (
                  <tr key={plan._id} className={styles.tableRow}>
                    <td>{plan.country}</td>
                    <td>{formatCurrency(plan.weekly, plan.currency)}</td>
                    <td>{formatCurrency(plan.monthly, plan.currency)}</td>
                    <td>{plan.currency || "N/A"}</td>
                    <td>
                      <EditIcon
                        onClick={() => handleEdit(plan._id)}
                        aria-label="edit payment"
                        className={styles.editIcon}
                      />
                    </td>
                    <td>
                      <DeleteIcon
                        onClick={() => handleDelete(plan._id)}
                        aria-label="delete payment"
                        className={styles.deleteIcon}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}