
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, RefreshCcw, Shield } from 'lucide-react';

export function ProductServiceInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2 text-ecommerce-600" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Free Standard Shipping</p>
                <p className="text-gray-600">On orders over $100. Delivery in 5-7 business days.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Express Shipping Available</p>
                <p className="text-gray-600">2-3 business days delivery for urgent orders.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">International Shipping</p>
                <p className="text-gray-600">Worldwide delivery available with tracking.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCcw className="w-5 h-5 mr-2 text-ecommerce-600" />
            Return Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">30-Day Return Window</p>
                <p className="text-gray-600">Return or exchange within 30 days of purchase.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Free Return Shipping</p>
                <p className="text-gray-600">We cover return shipping costs for eligible items.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Money-Back Guarantee</p>
                <p className="text-gray-600">Full refund if you're not completely satisfied.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-ecommerce-600" />
            Warranty & Care
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Lifetime Warranty</p>
                <p className="text-gray-600">Coverage against manufacturing defects.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Professional Cleaning</p>
                <p className="text-gray-600">Complimentary cleaning service available.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ecommerce-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Repair Services</p>
                <p className="text-gray-600">Expert repair and maintenance services.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
