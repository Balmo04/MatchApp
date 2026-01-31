
import React, { useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface UploadSectionProps {
  onImageSelected: (base64: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-slate-900 dark:text-white">Step 1: Your Canvas</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Upload a clear, full-body photo of yourself. For best results, use a well-lit environment and neutral background.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-80 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-8 h-8 text-slate-400 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          </div>
          <span className="text-lg font-medium text-slate-700 dark:text-slate-200">Upload from Gallery</span>
          <span className="text-sm text-slate-400 dark:text-slate-500 mt-1">PNG, JPG up to 10MB</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <div className="relative h-80 bg-slate-900 rounded-[2rem] flex flex-col items-center justify-center text-white overflow-hidden group cursor-not-allowed">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600" 
              className="w-full h-full object-cover"
              alt="Model guide"
            />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full mb-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <span className="text-lg font-medium">Use Live Camera</span>
            <span className="text-sm text-slate-300 mt-1">Coming soon to Mobile</span>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 flex-shrink-0 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Our AI Privacy Promise</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Your photos are processed in real-time and never stored permanently on our servers unless you choose to save your look. We prioritize your privacy as much as your style.</p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
