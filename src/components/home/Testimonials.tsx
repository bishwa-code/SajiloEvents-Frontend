import React from "react";
import Slider from "react-slick";

interface Testimonial {
  quote: string;
  author: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "The events platform made it so easy to stay updated and register. Loved the workshop on startups!",
    author: "Anisha Gautam, BSc CSIT, 7th Sem",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    quote:
      "Before this system, we’d miss half the events. Now I get all notices and announcements in one place.",
    author: "Roshan Thapa, BBS, 5th Sem",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "Really liked how we could register online for events like the IT Meetup. Saved so much time!",
    author: "Sushma Karki, BIM, 3rd Sem",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote:
      "The system makes it easier for organizers too. As a CR, I helped manage registrations seamlessly.",
    author: "Pratik Bhandari, BSc CSIT, 7th Sem",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    quote:
      "Very clean interface and well organized. Notices are no longer missed!",
    author: "Manish Paudel, BSc CSIT, 5th Sem",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
  },
  {
    quote:
      "Loved the event highlights and post updates. Feels like our campus is becoming more active digitally.",
    author: "Sweta Sharma, BBA, 6th Sem",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
  },
];

const Testimonials: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024, // tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // phones
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings}>
        {testimonials.map((t, idx) => (
          <div key={idx} className="px-4">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center text-center h-full">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-blue-500 shadow-md"
              />
              <blockquote className="italic text-gray-700 dark:text-gray-300 text-lg mb-4">
                “{t.quote}”
              </blockquote>
              <cite className="font-semibold text-blue-600 dark:text-blue-400">
                — {t.author}
              </cite>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
