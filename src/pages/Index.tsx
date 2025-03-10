
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { ArrowRight, Sparkles, BarChart, Utensils, Clock } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-36 md:pb-24 container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6 animate-fade-in">
            Your personal nutrition guide
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Smart, personalized <span className="text-primary">nutrition</span> for your lifestyle
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Get customized meal plans based on your body, goals, and preferences.
            Indian cuisine that nourishes your body and delights your taste buds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to={isAuthenticated ? "/profile" : "/auth/signup"}>
              <Button size="lg" className="flex items-center gap-2">
                {isAuthenticated ? 'Go to Your Profile' : 'Get Started'} <ArrowRight size={16} />
              </Button>
            </Link>
            
            {!isAuthenticated && (
              <Link to="/auth/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How NutrienGuide Works</h2>
            <p className="text-muted-foreground">
              Using AI-powered technology to create perfectly balanced meal plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-accent rounded-xl p-6 transition-all hover:shadow-md animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Cutting-edge AI technology analyzes your profile to generate personalized recommendations.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-accent rounded-xl p-6 transition-all hover:shadow-md animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nutrition Focused</h3>
              <p className="text-muted-foreground">
                Balanced meals with optimal macronutrients based on your body and goals.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-accent rounded-xl p-6 transition-all hover:shadow-md animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Utensils size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Indian Cuisine</h3>
              <p className="text-muted-foreground">
                Authentic Indian recipes that are healthy, delicious, and easy to prepare.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-accent rounded-xl p-6 transition-all hover:shadow-md animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Plans</h3>
              <p className="text-muted-foreground">
                Full day meal plans from breakfast to dinner, with snacks in between.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Get Started Section */}
      <section className="py-16 bg-primary/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center rounded-2xl bg-white shadow-sm border border-border p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your nutrition?</h2>
            <p className="text-muted-foreground mb-8">
              Create your profile and get your personalized Indian meal plan in minutes.
            </p>
            
            <Link to={isAuthenticated ? "/profile" : "/auth/signup"}>
              <Button size="lg">
                {isAuthenticated ? 'Go to Your Profile' : 'Get Started Now'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-white border-t border-border">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} NutrienGuide. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
