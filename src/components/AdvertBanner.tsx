import React from 'react';

export function AdvertBanner() {
  const announcements = [
    "🚚 FREE SHIPPING for orders above $500",
    "✨ New arrivals just dropped - Shop now!",
    "📢 Important: Limited time offers available",
    "🎉 Premium quality products at unbeatable prices",
    "💝 Special discounts for loyal customers"
  ];

  return (
    <div className="sticky top-16 lg:top-20 z-40 bg-gradient-to-r from-ecommerce-600 to-ecommerce-700 text-white overflow-hidden">
      <div className="relative h-10 flex items-center">
        <div className="animate-scroll flex whitespace-nowrap">
          {announcements.map((announcement, index) => (
            <span
              key={index}
              className="inline-block px-8 text-sm font-medium"
            >
              {announcement}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {announcements.map((announcement, index) => (
            <span
              key={`duplicate-${index}`}
              className="inline-block px-8 text-sm font-medium"
            >
              {announcement}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}