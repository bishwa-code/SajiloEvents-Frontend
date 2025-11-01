import React from "react";
import {
  FaGraduationCap,
  FaFlask,
  FaLaptopCode,
  FaStar,
  FaHandshake,
  FaPlusCircle,
} from "react-icons/fa";

const categories = [
  {
    name: "Academic",
    icon: (
      <FaGraduationCap className="text-3xl text-blue-600 dark:text-blue-400" />
    ),
  },
  {
    name: "Workshop",
    icon: <FaFlask className="text-3xl text-blue-600 dark:text-blue-400" />,
  },
  {
    name: "Tech Events",
    icon: (
      <FaLaptopCode className="text-3xl text-blue-600 dark:text-blue-400" />
    ),
  },
  {
    name: "Cultural",
    icon: <FaStar className="text-3xl text-blue-600 dark:text-blue-400" />,
  },
  {
    name: "Orientation",
    icon: <FaHandshake className="text-3xl text-blue-600 dark:text-blue-400" />,
  },
  {
    name: "Others",
    icon: (
      <FaPlusCircle className="text-3xl text-blue-600 dark:text-blue-400" />
    ),
  },
];

const CategorySection: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
      {categories.map((category) => (
        <div
          key={category.name}
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
        >
          <div className="mb-4">{category.icon}</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {category.name}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;
