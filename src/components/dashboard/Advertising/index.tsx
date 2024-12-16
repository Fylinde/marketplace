import React, { useState, useEffect } from "react";
import AdCampaignManager from "./AdCampaignManager";
import CouponsAndDeals from "./CouponsAndDeals";
import { CouponForm } from "./CouponForm";

interface Coupon {
  id: string;
  title: string;
  discount: string;
  expiryDate: string;
}

interface AdCampaign {
  id: string;
  name: string;
  budget: number;
  performance: string;
}

interface AdvertisingData {
  adCampaigns: AdCampaign[];
  coupons: Coupon[];
  performance: {
    couponsUsed: number;
    couponRevenue: number;
  };
}

const Advertising: React.FC = () => {
  const [data, setData] = useState<AdvertisingData | null>(null);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData: AdvertisingData = {
        adCampaigns: [
          { id: "1", name: "Campaign A", budget: 5000, performance: "Good" },
          { id: "2", name: "Campaign B", budget: 3000, performance: "Average" },
        ],
        coupons: [
          { id: "1", title: "10% Off", discount: "10%", expiryDate: "2024-12-31" },
          { id: "2", title: "20% Off", discount: "20%", expiryDate: "2024-11-30" },
        ],
        performance: {
          couponsUsed: 120,
          couponRevenue: 2500,
        },
      };

      setData(fetchedData);
    };

    fetchData();
  }, []);

  const handleDeleteCoupon = (couponId: string) => {
    if (data) {
      setData({
        ...data,
        coupons: data.coupons.filter((coupon) => coupon.id !== couponId),
      });
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Advertising Management</h1>

      {/* Ad Campaign Manager */}
      <AdCampaignManager
        data={data.adCampaigns}
        onUpdate={(updatedCampaigns) =>
          setData((prev) =>
            prev ? { ...prev, adCampaigns: updatedCampaigns } : prev
          )
        }
      />

      {/* Coupons and Deals */}
      <CouponsAndDeals
        coupons={data.coupons}
        performance={data.performance}
        onDeleteCoupon={handleDeleteCoupon}
      />

      {/* Create New Coupon Section */}
      {isCreatingCoupon ? (
        <CouponForm
          onSubmit={(newCoupon) =>
            setData((prev) =>
              prev
                ? { ...prev, coupons: [...prev.coupons, newCoupon] }
                : prev
            )
          }
          onCancel={() => setIsCreatingCoupon(false)}
        />
      ) : (
        <button onClick={() => setIsCreatingCoupon(true)}>
          Create New Coupon
        </button>
      )}
    </div>
  );
};

export default Advertising;
