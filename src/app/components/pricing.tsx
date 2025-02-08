import React from 'react';

// Reusable Card Component
interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  isPremium: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, description, price, features, isPremium }) => {
  return (
    <div
      className={`w-[327px] h-[664px] border rounded-[10px] p-[30px] ${
        isPremium ? 'bg-[#252B42] text-white' : 'bg-[#FFFFFF] text-[#252B42]'
      }`}
    >
      <h3 className="font-Montserrat text-[25px] font-bold mb-[10px]">{title}</h3>
      <p className="font-Montserrat text-[16px] leading-[24px] mb-[30px]">
        {description}
      </p>
      <div className="mb-[30px]">
        <span className="font-Montserrat text-[45px] font-bold">${price}</span>
        <span className="font-Montserrat text-[16px] leading-[24px]">/Per Month</span>
      </div>
      <ul className="space-y-[20px] mb-[30px]">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {/* <Image src={circle} alt="check" width={16} height={16} /> */}
            <span className="ml-[10px] font-Montserrat text-[16px] leading-[24px]">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button
        className={`w-[246px] h-[52px] rounded-[26px] font-Montserrat text-[16px] font-bold ${
          isPremium ? 'bg-white text-[#252B42]' : 'bg-[#23A6F0] text-white'
        }`}
      >
        Order Now
      </button>
    </div>
  );
};

const PricingPlans = () => {
  const plans = [
    {
      title: 'FREE',
      description: 'Organize across all apps by hand.',
      price: '0',
      features: ['Unlimited product updates', '1GB Cloud storage', 'Email and community support'],
      isPremium: false,
    },
    {
      title: 'STANDARD',
      description: 'Organize across all apps by hand.',
      price: '9.99',
      features: ['Unlimited product updates', '5GB Cloud storage', 'Priority email support'],
      isPremium: false,
    },
    {
      title: 'PREMIUM',
      description: 'Organize across all apps by hand.',
      price: '19.99',
      features: ['Unlimited product updates', '20GB Cloud storage', '24/7 Support'],
      isPremium: true,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-[20px] items-center justify-center">
      {plans.map((plan, index) => (
        <PricingCard
          key={index}
          title={plan.title}
          description={plan.description}
          price={plan.price}
          features={plan.features}
          isPremium={plan.isPremium}
        />
      ))}
    </div>
  );
};

export default PricingPlans;