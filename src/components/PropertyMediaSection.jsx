import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Video, 
  FileVideo, 
  Play, 
  ExternalLink, 
  Film, 
  CheckCircle2, 
  Image as ImageIcon, 
  Sparkles, 
  Tag, 
  Layers 
} from 'lucide-react';

export const PHOTO_CATEGORIES = [
  'Property Front View',
  'Living / Drawing Room',
  'Bedrooms',
  'Kitchen',
  'Bathrooms',
  'Parking / Porch',
  'Balcony / Terrace',
  'Road & Surroundings',
  'Plot Boundaries',
  'Commercial Frontage'
];

export default function PropertyMediaSection({
  images = [],
  onImagesChange,
  videoFile = null,
  onVideoFileChange,
  videoUrl = '',
  onVideoUrlChange,
  maxImages = 15,
  category = 'kothi'
}) {
  const [selectedTag, setSelectedTag] = useState('Property Front View');
  const [isCompressing, setIsCompressing] = useState(false);

  // Filter categories relevant to property type
  const relevantCategories = PHOTO_CATEGORIES.filter(cat => {
    if (category === 'plot' || category === 'land') {
      return ['Property Front View', 'Road & Surroundings', 'Plot Boundaries'].includes(cat);
    }
    if (category === 'commercial') {
      return ['Commercial Frontage', 'Property Front View', 'Parking / Porch', 'Road & Surroundings', 'Bathrooms'].includes(cat);
    }
    // residential
    return cat !== 'Plot Boundaries' && cat !== 'Commercial Frontage';
  });

  // Client-side image compression
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsCompressing(true);
    const newItems = [];

    for (const file of files) {
      if (images.length + newItems.length >= maxImages) break;
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl) {
        newItems.push({
          url: compressedDataUrl,
          tag: selectedTag || 'Property Front View',
          name: file.name
        });
      }
    }

    onImagesChange([...images, ...newItems]);
    setIsCompressing(false);
    e.target.value = '';
  };

  const handleRemovePhoto = (index) => {
    const updated = images.filter((_, idx) => idx !== index);
    onImagesChange(updated);
  };

  const handleUpdatePhotoTag = (index, newTag) => {
    const updated = images.map((item, idx) => {
      if (idx === index) {
        return typeof item === 'string' ? { url: item, tag: newTag } : { ...item, tag: newTag };
      }
      return item;
    });
    onImagesChange(updated);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("Video file size exceeds 25MB. Please upload a short walkthrough clip (30-60 seconds) or provide a YouTube / Google Drive link.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onVideoFileChange({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Categorized Photos & Walkthrough Video
          </span>
        </div>
        <span className="text-[10px] text-rose-800 bg-rose-100 font-bold px-2 py-0.5 rounded-full">
          {images.length} / {maxImages} Photos
        </span>
      </div>

      {/* Target Category Selector for Next Upload */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-rose-600" />
            Select Photo Category Before Snapping / Uploading:
          </span>
          <span className="text-rose-600 font-semibold">{selectedTag}</span>
        </label>
        
        <div className="flex flex-wrap gap-1.5">
          {relevantCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedTag(cat)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                selectedTag === cat
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Upload & Camera Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Direct Camera Capture */}
        <label className="p-3 border-2 border-dashed border-rose-300 rounded-xl bg-rose-50/50 hover:bg-rose-100/60 flex items-center justify-center gap-2 cursor-pointer transition-all">
          <Camera className="w-5 h-5 text-rose-600" />
          <span className="text-xs font-bold text-rose-900">
            {isCompressing ? 'Compressing...' : `Snap Photo as "${selectedTag}"`}
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
            disabled={images.length >= maxImages || isCompressing}
            className="hidden"
          />
        </label>

        {/* Gallery Multi-upload */}
        <label className="p-3 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer transition-all">
          <Upload className="w-5 h-5 text-slate-600" />
          <span className="text-xs font-bold text-slate-700">
            Upload from Phone Gallery (Multi-Select)
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            disabled={images.length >= maxImages || isCompressing}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Photos Grid with Category Tags */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
          {images.map((item, idx) => {
            const imgUrl = typeof item === 'string' ? item : item.url;
            const imgTag = typeof item === 'string' ? 'Property View' : (item.tag || 'Property View');

            return (
              <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 group bg-black shadow-2xs">
                <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                
                {/* Category Badge on photo */}
                <div className="absolute top-1 left-1 bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded max-w-[85%] truncate">
                  {imgTag}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md shadow-xs opacity-90 hover:opacity-100 cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                {/* Change tag select */}
                <div className="absolute bottom-1 inset-x-1">
                  <select
                    value={imgTag}
                    onChange={(e) => handleUpdatePhotoTag(idx, e.target.value)}
                    className="w-full bg-black/80 text-white text-[9px] font-bold rounded px-1 py-0.5 border border-white/20 focus:outline-none"
                  >
                    {PHOTO_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Walkthrough Video Section */}
      <div className="pt-2 border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-1.5">
          <Video className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-slate-800">
            Property Video Walkthrough (Max 25MB or Link)
          </span>
        </div>

        {videoFile ? (
          <div className="bg-white border border-purple-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                <FileVideo className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">{videoFile.name}</span>
                <span className="text-slate-400 font-normal">({videoFile.size})</span>
              </div>
              <button
                type="button"
                onClick={() => onVideoFileChange(null)}
                className="text-red-600 hover:underline text-[11px] font-bold cursor-pointer"
              >
                Remove Video
              </button>
            </div>

            {videoFile.dataUrl && (
              <video
                src={videoFile.dataUrl}
                controls
                className="w-full max-h-48 rounded-lg bg-black object-contain shadow-inner"
              />
            )}
          </div>
        ) : (
          <label className="p-3 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/50 hover:bg-purple-100/60 flex items-center justify-center gap-2 cursor-pointer transition-all">
            <Film className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-900">
              Record / Upload Walkthrough Video (Max 25MB)
            </span>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>
        )}

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
            <ExternalLink className="w-3 h-3 text-blue-600" />
            <span>Or Paste Walkthrough Video Link (YouTube / Google Drive / Instagram Reel):</span>
          </label>
          <input
            type="url"
            value={videoUrl || ''}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder="https://youtu.be/... or Google Drive video link"
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>
    </div>
  );
}
