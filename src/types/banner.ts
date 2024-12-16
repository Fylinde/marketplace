// Enriched Banner Type
export interface Banner {
    id: string; // Unique identifier for the banner
    title: string; // Primary headline text for the banner
    subtitle?: string; // Optional subtitle for additional context
    description?: string; // Longer description for more information
    image: string; // Primary image for the banner
    mobileImage?: string; // Optional mobile-optimized image
    backgroundColor?: string; // Background color for the banner
    gradientOverlay?: string; // Optional gradient overlay (e.g., "linear-gradient(...)")
    link?: string; // Optional URL the banner links to
    callToAction?: BannerCallToAction; // Call-to-action (button or interaction)
    video?: BannerVideo; // Optional embedded video configuration
    carousel?: BannerCarousel; // Optional carousel of images or media
    metadata?: Record<string, any>; // Custom metadata for extensibility
    positionPriority?: number; // To determine priority in display order
    animation?: BannerAnimation; // Optional animation settings
    displayDuration?: number; // Duration (in seconds) the banner is displayed
    visibilityRules?: VisibilityRules; // Rules for when to display this banner
    tags?: string[]; // Tags for categorization (e.g., "sale", "holiday")
    createdAt: string; // Timestamp for when the banner was created
    updatedAt?: string; // Timestamp for the last update

    size: "large" | "small"; // Banner size type
   
    imgUrl: string; // Banner image URL
    alt?: string; // Alternative text for the image

}
  
  // Call-to-action (CTA) structure
  export interface BannerCallToAction {
    label: string; // Text for the CTA button (e.g., "Shop Now", "Learn More")
    actionType: "link" | "modal" | "scrollTo" | "custom"; // Type of action
    target?: string; // Target link (if actionType is "link")
    payload?: any; // Custom payload for actions like modals or custom interactions
  }
  
  // Video configuration for a banner
  export interface BannerVideo {
    videoUrl: string; // URL to the video
    autoplay?: boolean; // Whether the video auto-plays
    loop?: boolean; // Whether the video loops
    controls?: boolean; // Whether playback controls are displayed
    muted?: boolean; // Whether the video is muted by default
    overlayText?: string; // Optional overlay text displayed over the video
  }
  
  // Carousel configuration for a banner
  export interface BannerCarousel {
    items: BannerCarouselItem[]; // Array of carousel items
    interval?: number; // Time (in seconds) between slides
    navigation?: boolean; // Whether navigation controls are shown
    paginationDots?: boolean; // Whether pagination dots are shown
  }
  
  // Carousel item type
  export interface BannerCarouselItem {
    id: string; // Unique identifier for the carousel item
    image: string; // Image for the carousel item
    title?: string; // Optional title for the carousel item
    subtitle?: string; // Optional subtitle for the carousel item
    link?: string; // Optional link for the carousel item
  }
  
  // Animation settings for the banner
  export interface BannerAnimation {
    type: "fade" | "slide" | "zoom" | "custom"; // Type of animation
    duration?: number; // Duration of the animation in milliseconds
    delay?: number; // Delay before animation starts
    customAnimationClass?: string; // Optional CSS class for custom animations
  }
  
  // Rules for banner visibility
  export interface VisibilityRules {
    startDate?: string; // Start date for banner visibility
    endDate?: string; // End date for banner visibility
    userRoles?: string[]; // Roles that can see this banner (e.g., "admin", "guest")
    devices?: ("mobile" | "desktop" | "tablet")[]; // Devices where the banner is displayed
    locations?: string[]; // Specific geographic locations (e.g., "US", "UK")
    conditions?: Record<string, any>; // Additional conditions for advanced rules
  }
  