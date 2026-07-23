import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../../lib/axios';

export default function ContentManagementPage() {
  const queryClient = useQueryClient();
  
  const [homeHeroBg, setHomeHeroBg] = useState<File | null>(null);
  const [aboutHeroBg, setAboutHeroBg] = useState<File | null>(null);

  // Fetch Settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data;
    },
  });

  const updateCmsMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/settings/cms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('CMS content updated successfully!');
      setHomeHeroBg(null);
      setAboutHeroBg(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update CMS content');
    }
  });

  const handleCmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (homeHeroBg) formData.append('home_hero_bg', homeHeroBg);
    if (aboutHeroBg) formData.append('about_hero_bg', aboutHeroBg);

    if (!homeHeroBg && !aboutHeroBg) {
      alert('Please select at least one image to upload.');
      return;
    }

    updateCmsMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading CMS content...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage dynamic images and texts for the public pages.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleCmsSubmit} className="space-y-8">
            
            {/* Home Hero Background */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Home Page Hero Background
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {settings?.home_hero_bg && !homeHeroBg && (
                  <div className="shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                    <img src={settings.home_hero_bg} alt="Home Hero" className="w-32 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 text-center px-2">
                        {homeHeroBg ? homeHeroBg.name : 'Click to upload new Home Hero Image'}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setHomeHeroBg(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* About Hero Background */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-500" />
                About Us Hero Background
              </h3>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {settings?.about_hero_bg && !aboutHeroBg && (
                  <div className="shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                    <img src={settings.about_hero_bg} alt="About Hero" className="w-32 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 text-center px-2">
                        {aboutHeroBg ? aboutHeroBg.name : 'Click to upload new About Hero Image'}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setAboutHeroBg(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={updateCmsMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateCmsMutation.isPending ? 'Uploading...' : 'Save CMS Content'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
