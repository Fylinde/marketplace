import axios from "axios";

const BASE_API_URL = "/api/checkout";

const checkoutService = {
  async getCountryList() {
    const response = await axios.get(`${BASE_API_URL}/countries`);
    return response.data.map((country: any) => ({
      label: country.name,
      value: country.code,
    }));
  },

  async submitOrder(checkoutState: any) {
    const orderData = {
      shippingAddress: checkoutState.shippingAddress,
      billingAddress: checkoutState.billingAddress,
      paymentMethod: checkoutState.paymentMethod,
      cartItems: checkoutState.cartItems.map((item: any) => ({
        id: item.id,
        sellerPrice: item.sellerPrice,
        buyerPrice: item.buyerPrice,
        quantity: item.quantity,
      })),
      deliveryOption: checkoutState.deliveryOption,
      totalSellerPrice: checkoutState.totalSellerPrice,
      totalBuyerPrice: checkoutState.totalBuyerPrice,
      discount: checkoutState.discount,
    };
    const response = await axios.post(`${BASE_API_URL}/place-order`, orderData);
    return response.data;
  },
};

export default checkoutService;
