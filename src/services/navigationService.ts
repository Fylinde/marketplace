const navigationService = {
    getNavigationItems: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              { title: "Home", icon: "home", href: "/" },
              { title: "Category", icon: "category", href: "/categories" },
              { title: "Cart", icon: "shopping_cart", href: "/cart" },
              { title: "Profile", icon: "account_circle", href: "/profile" },
            ],
          });
        }, 1000); // Simulate API delay
      });
    },
  };
  
  export default navigationService;
  