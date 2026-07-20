import { Card } from "./ui/Card"
import { Image, Phone, Users, Calendar, Zap, Award } from "lucide-react"

function Home() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-[#120727] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Text content */}
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-down">Welcome to EventPro</h1>
              <p className="text-xl mb-8 animate-slide-down" style={{animationDelay: "0.2s"}}>Your all-in-one solution for seamless event management</p>
              <button className="bg-white text-[#120727] px-6 py-3 rounded-full font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: "0.4s"}}>
                Get Started
              </button>
            </div>
            
            {/* Right side - Animated image */}
            <div className="hidden md:flex justify-center items-center animate-float" style={{animationDelay: "0.3s"}}>
              <div className="relative w-80 h-80">
                {/* Floating background shape */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-20 animate-pulse-soft blur-2xl"></div>
                
                {/* Event management themed SVG/Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-72 h-72 animate-scale-in" style={{animationDelay: "0.5s"}} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Calendar/Event icon */}
                    <rect x="30" y="40" width="140" height="120" rx="10" fill="none" stroke="white" strokeWidth="2"/>
                    <line x1="30" y1="70" x2="170" y2="70" stroke="white" strokeWidth="2"/>
                    <circle cx="55" cy="100" r="8" fill="white" opacity="0.7"/>
                    <circle cx="100" cy="100" r="8" fill="white" opacity="0.7"/>
                    <circle cx="145" cy="100" r="8" fill="white" opacity="0.7"/>
                    <circle cx="55" cy="135" r="8" fill="white" opacity="0.7"/>
                    <circle cx="100" cy="135" r="8" fill="white" opacity="0.7"/>
                    <circle cx="145" cy="135" r="8" fill="white" opacity="0.7"/>
                    {/* Decorative dots */}
                    <circle cx="70" cy="30" r="3" fill="currentColor" className="text-pink-400"/>
                    <circle cx="150" cy="50" r="2" fill="currentColor" className="text-purple-400"/>
                    <circle cx="40" cy="170" r="2" fill="currentColor" className="text-purple-400"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto mt-12 px-4">
        {/* Quick Actions */}
        <h2 className="text-3xl font-bold mb-6 animate-fade-in">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="animate-slide-up" style={{animationDelay: "0s"}}>
            <Card
              title="Generate Image"
              description="Create promotional images for your events"
              icon={<Image size={24} />}
              to="/generate-image"
            />
          </div>
          <div className="animate-slide-up" style={{animationDelay: "0.1s"}}>
            <Card
              title="Contact Vendors"
              description="Reach out to event vendors for your needs"
              icon={<Phone size={24} />}
              to="/contact-vendors"
            />
          </div>
          <div className="animate-slide-up" style={{animationDelay: "0.2s"}}>
            <Card
              title="My Vendors"
              description="Manage your preferred vendors list"
              icon={<Users size={24} />}
              to="/my-vendors"
            />
          </div>
        </div>

        {/* Statistics Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12 animate-scale-in">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">EventPro at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center hover:scale-105 transition-transform duration-300 animate-slide-up" style={{animationDelay: "0s"}}>
              <Calendar size={40} className="text-[#120727] mr-4 animate-float" />
              <div>
                <p className="text-3xl font-bold">1,000+</p>
                <p className="text-gray-600">Events Managed</p>
              </div>
            </div>
            <div className="flex items-center hover:scale-105 transition-transform duration-300 animate-slide-up" style={{animationDelay: "0.1s"}}>
              <Users size={40} className="text-[#120727] mr-4 animate-float" style={{animationDelay: "0.5s"}} />
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-gray-600">Happy Clients</p>
              </div>
            </div>
            <div className="flex items-center hover:scale-105 transition-transform duration-300 animate-slide-up" style={{animationDelay: "0.2s"}}>
              <Zap size={40} className="text-[#120727] mr-4 animate-float" style={{animationDelay: "1s"}} />
              <div>
                <p className="text-3xl font-bold">99%</p>
                <p className="text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 animate-fade-in">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop", title: "Party Celebration" },
              { id: 2, image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=250&fit=crop", title: "Festival Event" },
              { id: 3, image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=250&fit=crop", title: "Birthday Bash" }
            ].map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: `${event.id * 0.1}s`}}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">Join us for an unforgettable experience!</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    <span>Upcoming</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12 animate-scale-in">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">What Our Clients Say</h2>
          <div className="flex items-center animate-slide-up">
            <Award size={48} className="text-[#120727] mr-6 animate-pulse-soft" />
            <blockquote className="italic text-gray-600">
              "EventPro has revolutionized the way we manage our events. It's intuitive, powerful, and has saved us
              countless hours!"
              <footer className="text-gray-800 font-semibold mt-2">- Sarah Johnson, Event Coordinator</footer>
            </blockquote>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home

