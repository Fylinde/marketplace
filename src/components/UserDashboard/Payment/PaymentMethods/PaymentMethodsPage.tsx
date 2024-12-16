import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentMethods, deletePaymentMethod } from "../../../../redux/slices/orders/paymentSlice";
import { useNavigate } from "react-router-dom";
import { getLocalizedText } from "../../../../utils/localizationUtils";
import type { AppDispatch } from "../../../../redux/store";


const PaymentMethodsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { paymentMethods, loading, error } = useSelector((state: any) => state.payment);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm(getLocalizedText("confirmDelete", "paymentMethods"))) {
      try {
        await dispatch(deletePaymentMethod(id)).unwrap();
        alert(getLocalizedText("deleteSuccess", "paymentMethods"));
      } catch (error) {
        if (error instanceof Error) {
          alert(getLocalizedText("deleteError", "paymentMethods", { error: error.message }));
        } else {
          alert(getLocalizedText("unknownError", "paymentMethods"));
        }
      }
    }
  };
  

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) return <p>{getLocalizedText("error", "common", { error })}</p>;

  return (
    <div>
      <h2>{getLocalizedText("paymentMethods", "paymentMethods")}</h2>
      <button onClick={() => navigate("/user-dashboard/payment/add")}>
        {getLocalizedText("addPaymentMethod", "paymentMethods")}
      </button>
      <ul>
        {paymentMethods.map((method: any) => (
          <li key={method.id}>
            <strong>{method.name}</strong> ({method.type})
            <div>
              <button onClick={() => navigate(`/user-dashboard/payment/edit/${method.id}`)}>
                {getLocalizedText("edit", "common")}
              </button>
              <button onClick={() => handleDelete(method.id)}>
                {getLocalizedText("delete", "common")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethodsPage;
