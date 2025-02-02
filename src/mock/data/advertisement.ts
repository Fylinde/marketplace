export const mockAppleWatchAdvertisement = {
    title: "50% Off For Your First Shopping",
    description: "Discover the revolutionary Apple Watch Ultra Pro. Packed with AI-driven features for health, fitness, and style. Don’t miss out on this exclusive offer.",
    imageUrl: "https://via.placeholder.com/800x400.png?text=Apple+Watch+Ultra+Pro", // Replace with actual product image
    ctaText: "Shop Now",
    ctaLink: "/shop/apple-watch-ultra-pro",
  };
  
  export const fetchMockAppleWatchAdvertisement = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    return mockAppleWatchAdvertisement;
  };
  