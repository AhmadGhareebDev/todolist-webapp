import React, { useState, useEffect } from "react";
import RegisterForm from "../components/RegisterForm";
import img1 from "../assets/1 (1).png";
import img2 from "../assets/1 (2).png";
import img3 from "../assets/1 (3).png";
import logo from "../assets/logo2.png"


const features = [
  {
    image: img1,
    title: "Create Tasks Effortlessly",
    description: "Quickly add new tasks with just a few clicks. Set priorities, due dates, and organize your workflow seamlessly."
  },
  {
    image: img2,
    title: "History for your finished Tasks",
    description: "See how you are spending your Time"
  },
  {
    image: img3,
    title: "Step Tasks",
    description: "For roadmaps, and separating your Tasks into Small Parts"
  }, 
  {
    image: logo,
    title: "AAGenda",
    description: "Plan it. Own it"
  }
];

export default function RegisterPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-violet-200 grid sm:grid-cols-2">
      <section className="bg-slate-100 flex flex-col items-center justify-center">
        <div className="flex items-center sm:justify-start justify-center p-6 border-b border-gray-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-xl text-xl font-bold shadow-lg">
            AA
          </div>
          <h1 className="font-bold text-2xl text-gray-800 ml-3 sm:block hidden">
            genda
          </h1>
        </div>

        <RegisterForm />
      </section>

      <section className="sm:block hidden relative bg-gradient-to-br from-violet-100 to-purple-50">
        <div className="h-full flex flex-col items-center justify-center p-8">
          <div 
            className={`w-full max-w-lg transition-all duration-500 transform ${
              isAnimating ? 'opacity-0  scale-75' : 'opacity-100 scale-100'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
              <img
                className="w-full h-80 object-cover"
                src={features[currentFeature].image}
                alt={features[currentFeature].title}
              />
            </div>

            <div className="text-center px-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {features[currentFeature].title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {features[currentFeature].description}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentFeature(index);
                    setIsAnimating(false);
                  }, 500);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentFeature
                    ? 'w-8 bg-indigo-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}