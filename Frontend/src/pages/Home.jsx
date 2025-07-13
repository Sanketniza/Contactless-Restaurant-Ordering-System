import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUtensils, FaClock, FaMobile } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
            alt="Restaurant Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contactless Dining Experience
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Order, pay, and enjoy your meal without waiting for service.
          </motion.p>
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/menu" className="btn-primary text-lg px-8 py-3">
              View Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="card text-center p-8"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaMobile className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Scan & Order</h3>
            <p className="text-gray-600">Scan the QR code at your table and browse our menu on your device.</p>
          </motion.div>
          
          <motion.div 
            className="card text-center p-8"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaUtensils className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Enjoy Your Meal</h3>
            <p className="text-gray-600">Your order is sent directly to our kitchen. We'll bring it to your table when it's ready.</p>
          </motion.div>
          
          <motion.div 
            className="card text-center p-8"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FaClock className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Pay & Go</h3>
            <p className="text-gray-600">Pay securely through the app when you're ready to leave. No waiting for the bill.</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to experience contactless dining?</h2>
          <p className="text-xl text-blue-100 mb-8">Join us today and enjoy a seamless dining experience.</p>
          <Link to="/menu" className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
