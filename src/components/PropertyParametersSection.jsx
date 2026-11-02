import React from 'react';
import { 
  Home, 
  Building2, 
  Compass, 
  Ruler, 
  Car, 
  Zap, 
  Droplets, 
  Layers, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Warehouse, 
  Trees, 
  CheckCircle2, 
  Check, 
  Plus, 
  Bed, 
  Bath, 
  UtensilsCrossed, 
  Sofa, 
  Tv, 
  ArrowUpDown,
  FileCheck2
} from 'lucide-react';

export const AREA_UNITS = ['Marla', 'Kanal', 'Sq. Ft.', 'Sq. Yard', 'Acre'];
export const FACING_DIRECTIONS = ['East', 'North', 'North-East', 'West', 'South', 'North-West', 'South-East', 'South-West'];
export const ROAD_WIDTHS = ['20 Feet Road', '25 Feet Road', '30 Feet Wide Road', '35 Feet Wide Road', '40 Feet Wide Road', '60+ Feet Main Highway / GT Road', '15 Feet Street'];
export const NEARBY_FACILITIES_LIST = [
  'School (within 1km)',
  'Civil Hospital (within 2km)',
  'Main Bus Stand',
  'Railway Station',
  'Local Market / Chowk',
  'Bank & ATM',
  'Park & Green Belt',
  'National Highway 54'
];

export default function PropertyParametersSection({ 
  formData, 
  onChange, 
  category = 'kothi' 
}) {
  const isResidential = category === 'kothi' || category === 'room' || category === 'residential';
  const isKothi = category === 'kothi';
  const isRoom = category === 'room';
  const isCommercial = category === 'commercial';
  const isPlot = category === 'plot';
  const isLand = category === 'land';

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const toggleNearbyFacility = (facility) => {
    const current = formData.nearbyFacilities || [];
    const exists = current.includes(facility);
    const updated = exists ? current.filter(f => f !== facility) : [...current, facility];
    handleFieldChange('nearbyFacilities', updated);
  };

  return (
    <div className="space-y-4">
      {/* 1. Property Name / Title & Core Dimensions */}
      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-blue-600" />
            Area, Dimensions & Orientation
          </span>
          <span className="text-[10px] text-blue-700 bg-blue-100 font-bold px-2 py-0.5 rounded-full uppercase">
            {category} Parameters
          </span>
        </div>

        {/* Title / Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Property Name / Listing Title *
          </label>
          <input
            type="text"
            required
            value={formData.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g. 10 Marla Corner Luxury Kothi on Jail Road or Prime SCO Booth"
            className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
          />
        </div>

        {/* Total Area & Area Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Total Area Size *
            </label>
            <input
              type="text"
              required
              value={formData.size || ''}
              onChange={(e) => handleFieldChange('size', e.target.value)}
              placeholder="e.g. 10, 12, 1 Room, 4"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Area Unit *
            </label>
            <select
              value={formData.unit || (isLand ? 'Kanal' : isRoom ? 'Room Set' : 'Marla')}
              onChange={(e) => handleFieldChange('unit', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            >
              {AREA_UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
              {isRoom && <option value="Room Set">Room Set</option>}
            </select>
          </div>
        </div>

        {/* Front Width & Depth Dimensions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Front Width (Ft)
            </label>
            <input
              type="text"
              value={formData.frontWidth || ''}
              onChange={(e) => handleFieldChange('frontWidth', e.target.value)}
              placeholder="e.g. 30 Ft"
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Depth / Length (Ft)
            </label>
            <input
              type="text"
              value={formData.depth || ''}
              onChange={(e) => handleFieldChange('depth', e.target.value)}
              placeholder="e.g. 75 Ft"
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            />
          </div>

          {(isResidential || isCommercial) && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Covered Area (Sq Ft)
              </label>
              <input
                type="text"
                value={formData.coveredArea || ''}
                onChange={(e) => handleFieldChange('coveredArea', e.target.value)}
                placeholder="e.g. 2400"
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Open Area / Lawn
            </label>
            <input
              type="text"
              value={formData.openArea || ''}
              onChange={(e) => handleFieldChange('openArea', e.target.value)}
              placeholder="e.g. 600 Sq Ft / Front lawn"
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Facing Direction, Road Width & Corner Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Facing Direction
            </label>
            <select
              value={formData.facing || 'East'}
              onChange={(e) => handleFieldChange('facing', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            >
              {FACING_DIRECTIONS.map(dir => (
                <option key={dir} value={dir}>{dir} (Vastu)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Front Road Width
            </label>
            <select
              value={formData.roadWidth || '30 Feet Wide Road'}
              onChange={(e) => handleFieldChange('roadWidth', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            >
              {ROAD_WIDTHS.map(rw => (
                <option key={rw} value={rw}>{rw}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={!!formData.isCorner}
                onChange={(e) => handleFieldChange('isCorner', e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span>Corner (2-Side Open)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Residential Room & Living Parameters (Visible only for Kothi / Room) */}
      {isResidential && (
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-emerald-600" />
              Room Layout & Residential Spaces
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
              Bedrooms & Living
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Bed className="w-3 h-3 text-emerald-600" />
                Bedrooms
              </label>
              <select
                value={formData.bedrooms || (isRoom ? '1' : '3')}
                onChange={(e) => handleFieldChange('bedrooms', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-900"
              >
                {['1', '2', '3', '4', '5', '6+'].map(num => (
                  <option key={num} value={num}>{num} {num === '1' ? 'Bed' : 'Beds'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Bath className="w-3 h-3 text-blue-600" />
                Bathrooms
              </label>
              <select
                value={formData.bathrooms || (isRoom ? '1' : '3')}
                onChange={(e) => handleFieldChange('bathrooms', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-900"
              >
                {['1', '2', '3', '4', '5+'].map(num => (
                  <option key={num} value={num}>{num} {num === '1' ? 'Bath' : 'Baths'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <UtensilsCrossed className="w-3 h-3 text-amber-600" />
                Kitchen
              </label>
              <select
                value={formData.kitchen || 'Modular Kitchen'}
                onChange={(e) => handleFieldChange('kitchen', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Modular Kitchen">Modular Kitchen</option>
                <option value="Semi-Modular Kitchen">Semi-Modular</option>
                <option value="Attached Kitchen">Attached Kitchen</option>
                <option value="Shared Kitchen">Shared Kitchen</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Sofa className="w-3 h-3 text-purple-600" />
                Drawing Room
              </label>
              <select
                value={formData.drawingRoom || 'Separate Drawing Room'}
                onChange={(e) => handleFieldChange('drawingRoom', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Separate Drawing Room">Separate Hall</option>
                <option value="Combined Lounge">Combined Lounge</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Tv className="w-3 h-3 text-rose-600" />
                Dining Room
              </label>
              <select
                value={formData.diningRoom || 'Attached Dining Area'}
                onChange={(e) => handleFieldChange('diningRoom', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Attached Dining Area">Attached Dining</option>
                <option value="Separate Dining Hall">Separate Hall</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floors, Elevation, Parking & Building Amenities (Kothi, Room, Commercial) */}
      {(isResidential || isCommercial) && (
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Floors, Elevation & Parking Facilities
            </span>
            <span className="text-[10px] text-indigo-800 bg-indigo-100 font-bold px-2 py-0.5 rounded-full">
              Building Structure
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Total Floors
              </label>
              <select
                value={formData.floors || (isKothi ? 'Double Story (G+1)' : 'Single Story (Ground)')}
                onChange={(e) => handleFieldChange('floors', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Single Story (Ground)">Single Story (Ground)</option>
                <option value="Double Story (G+1)">Double Story (G+1)</option>
                <option value="Triple Story (G+2)">Triple Story (G+2)</option>
                <option value="4+ Floors Building">4+ Floors Building</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Floor Position
              </label>
              <select
                value={formData.floorNumber || 'Full Independent House'}
                onChange={(e) => handleFieldChange('floorNumber', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Full Independent House">Full House / Building</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor (1st)</option>
                <option value="Second Floor">Second Floor (2nd)</option>
                <option value="Top Floor with Roof">Top Floor with Roof</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Car className="w-3 h-3 text-emerald-600" />
                Parking Space
              </label>
              <select
                value={formData.parking || 'Covered Car Porch + 2-Wheeler'}
                onChange={(e) => handleFieldChange('parking', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Covered Car Porch + 2-Wheeler">Covered Car Porch</option>
                <option value="Double Car Garage">Double Car Garage (2 SUVs)</option>
                <option value="2-Wheeler Only">2-Wheeler Covered</option>
                <option value="Street Parking Available">Street Parking Available</option>
                <option value="None">No Dedicated Parking</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Furnishing Status
              </label>
              <select
                value={formData.furnishingStatus || 'Semi-Furnished'}
                onChange={(e) => handleFieldChange('furnishingStatus', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Semi-Furnished">Semi-Furnished (Wardrobes/Fans)</option>
                <option value="Fully Furnished">Fully Furnished (AC/Beds/Sofa)</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Balcony
              </label>
              <select
                value={formData.balcony || 'Front Balcony'}
                onChange={(e) => handleFieldChange('balcony', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Front Balcony">Front Balcony</option>
                <option value="2+ Balconies (Front & Rear)">2+ Balconies</option>
                <option value="None">No Balcony</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Terrace / Roof
              </label>
              <select
                value={formData.terrace || 'Private Independent Terrace'}
                onChange={(e) => handleFieldChange('terrace', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Private Independent Terrace">Private Terrace</option>
                <option value="Shared Terrace">Shared Terrace</option>
                <option value="No Roof Access">No Roof Access</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Lift / Elevator
              </label>
              <select
                value={formData.lift || 'Not Available'}
                onChange={(e) => handleFieldChange('lift', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Not Available">Not Available</option>
                <option value="Available">Available (Passenger Lift)</option>
                <option value="Lift Shaft Provision">Lift Shaft Provision</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Construction Year & Condition
              </label>
              <select
                value={formData.propertyCondition || 'Brand New / Ready to Move'}
                onChange={(e) => handleFieldChange('propertyCondition', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
              >
                <option value="Brand New / Ready to Move">Brand New (2025-2026)</option>
                <option value="Well Maintained (1-5 Years)">Well Maintained (1-5 Yrs)</option>
                <option value="Needs Renovation">Needs Renovation</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Infrastructure & Utilities (Boundary Wall, Water, Electricity, Sewerage, Gated Society) */}
      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Infrastructure & Utilities
          </span>
          <span className="text-[10px] text-slate-500 font-bold">
            Essential Facilities
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-500" />
              Water Supply
            </label>
            <select
              value={formData.waterSupply || '24x7 Submersible / Borewell'}
              onChange={(e) => handleFieldChange('waterSupply', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            >
              <option value="24x7 Submersible / Borewell">24x7 Submersible</option>
              <option value="Municipal Corporation Supply">Municipal MC Supply</option>
              <option value="Submersible + MC Water">Both (Submersible + MC)</option>
              <option value="Tubewell / Canal Water">Tubewell / Canal</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Electricity
            </label>
            <select
              value={formData.electricity || 'Domestic 24x7 Connection'}
              onChange={(e) => handleFieldChange('electricity', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            >
              <option value="Domestic 24x7 Connection">Domestic 24x7 Connection</option>
              <option value="Commercial 3-Phase Meter">Commercial 3-Phase Meter</option>
              <option value="Separate Sub-Meter">Separate Sub-Meter</option>
              <option value="Agricultural Tubewell Power">Agricultural Power</option>
              <option value="Meter to be Installed">Meter to be Installed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Sewerage
            </label>
            <select
              value={formData.sewerage || 'Underground Municipal Sewerage'}
              onChange={(e) => handleFieldChange('sewerage', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            >
              <option value="Underground Municipal Sewerage">Underground Municipal</option>
              <option value="Septic Tank">Septic Tank Constructed</option>
              <option value="Under Construction">Under Construction</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Boundary Wall
            </label>
            <select
              value={formData.boundaryWall || (isPlot || isLand ? 'Boundary Wall Constructed with Gate' : 'Four-Wall Constructed')}
              onChange={(e) => handleFieldChange('boundaryWall', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-900"
            >
              <option value="Boundary Wall Constructed with Gate">Constructed with Gate</option>
              <option value="Four-Wall Constructed">Four-Wall Constructed</option>
              <option value="Boundary Pillars Demarcated">Pillars Demarcated</option>
              <option value="Open Boundary">Open Boundary</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        {/* Gated Society Toggle */}
        <div className="pt-1 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={!!formData.gatedSociety}
              onChange={(e) => handleFieldChange('gatedSociety', e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
            <span>Gated Society / Protected Colony with Security Guard</span>
          </label>
        </div>
      </div>

      {/* 5. Nearby Facilities Checklist */}
      <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2.5">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
          Nearby Facilities & Distance Highlights
        </label>
        <div className="flex flex-wrap gap-1.5">
          {NEARBY_FACILITIES_LIST.map((fac) => {
            const isSelected = (formData.nearbyFacilities || []).includes(fac);
            return (
              <button
                key={fac}
                type="button"
                onClick={() => toggleNearbyFacility(fac)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                <span>{fac}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
