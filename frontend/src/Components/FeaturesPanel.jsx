import React from "react";
import {
  Heart,
  CreditCard,
  HandshakeIcon,
  Users,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const FeaturesPanel = () => {
  const cards = [
    {
      title: "Personalized for KU",
      icon: <Heart className="w-8 h-8" />,
      description:
        "A Social media App, Specifically for our people associated with Kathmandu University !",
    },
    {
      title: "Mark your Events",
      icon: <Calendar className="w-8 h-8" />,
      description:
        "A personalized space to keep track of all the events happening around, #NeverMissThem",
    },
    {
      title: "Join Our Community",
      icon: <HandshakeIcon className="w-8 h-8" />,
      description:
        "Interact with Multiple and Diverse communities at KU for extensive network of people",
    },
    {
      title: "Connect with People!",
      icon: <Users className="w-8 h-8" />,
      description: "Your Friends and your people, See what they are upto ! ",
    },
  ];

  return (
    <div className="relative min-h-[85vh] w-[95%] mt-[5vh] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl mdd:text-5xl font-bold text-gray-800">
          Our Unique Features
        </h1>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4"></div>
      </motion.div>

      <div className="relative z-10 container mx-auto p-4 mdd:p-8">
        <div className="flex flex-wrap mdd:flex-nowrap gap-8">
          {/* Main Story Section - Takes up left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full mdd:w-[35%] bg-white p-6 mdd:p-8 rounded-lg shadow-lg"
          >
            <h1 className="text-3xl mdd:text-4xl font-bold mb-4">
              Story About What We Do
            </h1>
            <p className="text-gray-600 mb-6">Ku-Verse</p>

            <button className="border-2 border-gray-800 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-800 hover:text-white transition-colors">
              LEARN MORE
            </button>
          </motion.div>

          <div className="w-full mdd:w-[65%] grid grid-cols-2 gap-4 mdd:gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-4 mdd:p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105"
              >
                <div className="bg-yellow-400 w-12 mdd:w-16 h-12 mdd:h-16 rounded-full flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h2 className="text-lg mdd:text-xl font-bold mb-2 mdd:mb-3">
                  {card.title}
                </h2>
                <p className="text-gray-600 text-sm mdd:text-base">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPanel;
