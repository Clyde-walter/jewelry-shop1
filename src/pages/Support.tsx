
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by visiting the Orders page in your account or using our Live Tracking feature."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all jewelry purchases. Items must be in original condition with tags attached."
  },
  {
    question: "Do you offer warranties on your jewelry?",
    answer: "Yes, all our jewelry comes with a lifetime warranty against manufacturing defects."
  },
  {
    question: "How do I care for my jewelry?",
    answer: "Store jewelry in a cool, dry place. Clean with a soft cloth and avoid exposure to chemicals and perfumes."
  },
  {
    question: "Can I resize my ring?",
    answer: "Most rings can be resized within 2 sizes up or down. Contact us for specific resizing options."
  },
  {
    question: "Do you offer custom designs?",
    answer: "Yes! We offer custom design services. Use our Custom Design request form to get started."
  }
];

export function Support() {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/chat');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Support Center</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to your questions or get help from our support team.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for help topics..."
            className="pl-10 py-3 text-lg"
          />
        </div>
      </div>

      {/* Quick Help Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Phone className="w-12 h-12 mx-auto mb-4 text-ecommerce-600" />
            <h3 className="text-lg font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak with our support team</p>
            <p className="font-medium">+1 (555) 123-4567</p>
          </CardContent>
        </Card>

        <Link to="/contact">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <Mail className="w-12 h-12 mx-auto mb-4 text-ecommerce-600" />
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us a detailed message</p>
              <Button variant="outline">Contact Us</Button>
            </CardContent>
          </Card>
        </Link>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-ecommerce-600" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with us in real-time</p>
            <Button 
              className="bg-ecommerce-600 hover:bg-ecommerce-700"
              onClick={handleStartChat}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <HelpCircle className="w-5 h-5 mr-2 text-ecommerce-600" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Help */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
        <p className="text-gray-600 mb-6">
          Our customer service team is available Monday through Friday, 9 AM to 7 PM EST.
        </p>
        <div className="space-x-4">
          <Link to="/contact">
            <Button className="bg-ecommerce-600 hover:bg-ecommerce-700">
              Contact Support
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline">
              Check Order Status
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
