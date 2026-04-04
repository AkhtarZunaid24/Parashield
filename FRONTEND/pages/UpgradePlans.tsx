import React from 'react';
import { Bike, Zap, Truck, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UpgradePlans: React.FC = () => {

  const currentPlan = "City Pro";

  const plans = [
    {
      name: "Lite Rider",
      price: "₹49",
      icon: <Bike className="w-8 h-8" />,
      features: [
        "Rainfall Payout (40mm+)",
        "Extreme Heat Payout (42°C+)",
        "Basic Social Disruption Guard",
        "Digital Dashboard Access",
        "Payout: ₹200"
      ],
      color: "bg-white",
      textColor: "text-black",
      buttonColor: "bg-black text-white",
      description: "Essential protection for part-time delivery partners."
    },
    {
      name: "City Pro",
      price: "₹99",
      icon: <Zap className="w-8 h-8" />,
      features: [
        "Rainfall Payout (35mm+)",
        "AQI Payout (Severe/300+)",
        "Heatwave Payout (40°C+)",
        "Market Closure Protection",
        "Priority Zone Analytics",
        "Payout: ₹400"
      ],
      color: "bg-yellow-400",
      textColor: "text-black",
      buttonColor: "bg-black text-white",
      popular: true,
      description: "The most popular choice for full-time gig workers."
    },
    {
      name: "Fleet Master",
      price: "₹179",
      icon: <Truck className="w-8 h-8" />,
      features: [
        "Rainfall Payout (30mm+)",
        "AQI Payout (Very Poor/250+)",
        "Extreme Heat Payout (38°C+)",
        "Income Protection (Daily)",
        "Instant Smart Contract Settlement",
        "Payout: ₹720"
      ],
      color: "bg-zinc-900",
      textColor: "text-white",
      buttonColor: "bg-yellow-400 text-black",
      description: "Premium coverage for heavy-duty delivery vehicles."
    }
  ];

  const planOrder = ["Lite Rider", "City Pro", "Fleet Master"];

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Title */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black uppercase tracking-tight">
              WEEKLY PROTECTION
            </h1>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, index) => {

              const currentIndex = planOrder.indexOf(currentPlan);
              const planIndex = planOrder.indexOf(plan.name);

              let buttonText = "";
              let isDisabled = false;

              if (plan.name === currentPlan) {
                buttonText = "SELECTED";
                isDisabled = true;
              } else if (planIndex > currentIndex) {
                buttonText = "UPGRADE PLAN";
              } else {
                buttonText = "DOWNGRADE PLAN";
              }

              return (
                <div
                  key={index}
                  className={`relative p-10 rounded-3xl border-2 min-h-[520px] flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.15)] ${plan.color} ${plan.textColor}`}
                >

                  {/* MOST POPULAR */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-4 py-1 rounded-full font-black uppercase">
                      MOST POPULAR
                    </div>
                  )}

                  {/* TOP CONTENT */}
                  <div>
                    <div className="mb-4">{plan.icon}</div>

                    <h2 className="text-lg font-black uppercase tracking-wide">
                      {plan.name}
                    </h2>

                    <p className="text-5xl font-black mb-1">
                      {plan.price}
                    </p>

                    <p className="text-xs font-semibold opacity-70 mb-4">
                      per week 
                    </p>

                    <p className="text-sm opacity-70 mb-4">
                      {plan.description}
                    </p>

                    <ul className="mt-6 mb-10 space-y-3">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex gap-3 items-center text-sm font-bold">
                          <Check className="w-4 h-4" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* BUTTON */}
                  <button
                    disabled={isDisabled}
                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                      isDisabled
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : `${plan.buttonColor} hover:scale-105 hover:shadow-lg active:scale-95`
                    }`}
                  >
                    {buttonText}
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpgradePlans;