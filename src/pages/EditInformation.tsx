
import React, { useEffect, useState, useRef } from 'react';
import { User, Mail, Phone, Calendar, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Avatar fallback image
const FALLBACK_AVATAR = "/placeholder.svg";
const PROFILE_IMAGE_BUCKET = "profile-images";

export function EditInformation() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    newsletter: false,
    smsNotifications: false,
    emailNotifications: false,
    profileImageUrl: '',
  });
  const [profileImage, setProfileImage] = useState(FALLBACK_AVATAR);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial user data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      // Fetch extended profile from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data) {
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: user.email ?? '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth || '',
          newsletter: data.newsletter ?? false,
          smsNotifications: data.sms_notifications ?? false,
          emailNotifications: data.email_notifications ?? false,
          profileImageUrl: data.profile_image_url || '',
        });
        setProfileImage(data.profile_image_url || FALLBACK_AVATAR);
      } else if (user) {
        setFormData(fd => ({ ...fd, email: user.email ?? '' }));
        setProfileImage(FALLBACK_AVATAR);
      }
    };
    fetchProfile();
  }, [user]);

  // Handle text/input/switch changes for all fields except image
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle image file selection and upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Ensure bucket exists (ignore error if already exists)
    await supabase.storage.createBucket(PROFILE_IMAGE_BUCKET, { public: true }).catch(() => {});

    const ext = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .upload(fileName, file, { upsert: true });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from(PROFILE_IMAGE_BUCKET)
        .getPublicUrl(fileName);
      if (urlData?.publicUrl) {
        setProfileImage(urlData.publicUrl);
        setFormData(prev => ({ ...prev, profileImageUrl: urlData.publicUrl }));
        toast({
          title: "Profile photo updated!",
          description: "Your profile photo has been changed successfully.",
        });
      }
    } else {
      toast({
        title: "Image upload failed",
        description: error?.message || "Could not upload image.",
        variant: "destructive",
      });
    }
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save profile to Supabase
  const handleSave = async () => {
    if (!user) {
      toast({ title: "Not signed in", description: "Please log in.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      date_of_birth: formData.dateOfBirth,
      profile_image_url: formData.profileImageUrl,
      newsletter: formData.newsletter,
      sms_notifications: formData.smsNotifications,
      email_notifications: formData.emailNotifications,
    });
    setLoading(false);
    if (!error) {
      toast({
        title: "Changes saved!",
        description: "Your information has been updated successfully.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Information</h1>

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profileImage} />
                <AvatarFallback className="text-xl">
                  {formData.firstName[0] ?? ''}{formData.lastName[0] ?? ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image-upload"
                  disabled={loading}
                />
                <label htmlFor="profile-image-upload">
                  <Button variant="outline" className="mb-2 cursor-pointer" asChild>
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-gray-600">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <div className="relative">
                    <Input 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Input 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    type="email"
                    disabled
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Input 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <div className="relative">
                  <Input 
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="pl-10"
                    type="date"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive order updates and promotions via email</p>
                </div>
                <Switch 
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive order updates via text message</p>
                </div>
                <Switch 
                  checked={formData.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Newsletter</h4>
                  <p className="text-sm text-gray-600">Stay updated with our latest collections</p>
                </div>
                <Switch 
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave}
            className="w-full bg-ecommerce-600 hover:bg-ecommerce-700"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
