
import shippingService from "../services/shippingService";
import  taxService  from "../services/taxService";

interface ShippingCalculatorParams {
  methodId: string;
  address: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };
  cartTotal: number;
}

interface ShippingCalculationResult {
  shippingCost: number;
  estimatedDelivery: string;
  totalCostWithShipping: number;
  taxes?: number;
}

const shippingCalculator = {
  async calculateShipping(params: ShippingCalculatorParams): Promise<ShippingCalculationResult> {
    const { methodId, address, cartTotal } = params;

    try {
      // Fetch shipping cost from shipping service
      const shippingCostData = await shippingService.calculateShippingCost({
        methodId,
        address,
      });

      const { shippingCost, estimatedDelivery } = shippingCostData;

      // Fetch tax information (if required)
      const taxData = await taxService.calculateTax({
        price: cartTotal + shippingCost,
        country: address.country,
        region: address.state,
      });

      return {
        shippingCost,
        estimatedDelivery,
        totalCostWithShipping: cartTotal + shippingCost + (taxData?.taxAmount || 0),
        taxes: taxData?.taxAmount,
      };
    } catch (error) {
      console.error("Error calculating shipping:", error);
      throw new Error("Failed to calculate shipping costs");
    }
  },
};

export default shippingCalculator;
