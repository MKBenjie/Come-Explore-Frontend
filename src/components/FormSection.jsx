import React, { useState } from 'react';
import WidgetCard from '../widgets/WidgetCard';
import IconMic from '../widgets/IconMic';

export default function FormSection({ onGenerate, isGenerating, statusMessage }) {
  // Exact form state from original code
  const [interests, setInterests] = useState('');
  const [visitorType, setVisitorType] = useState('ugandan');
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState('mid');
  const [travelerType, setTravelerType] = useState('solo');
  const [destinations, setDestinations] = useState('');
  const [peopleCount, setPeopleCount] = useState(1);

  // Location fetching state
  const [isLocating, setIsLocating] = useState(false);
  const [useLocationOverride, setUseLocationOverride] = useState(true);

  // Sync handlers for range/number inputs
  const handleDaysChange = (val) => {
    const clamped = Math.min(60, Math.max(1, Number(val) || 1));
    setDays(clamped);
  };

  const handlePeopleChange = (val) => {
    const clamped = Math.min(60, Math.max(1, Number(val) || 1));
    setPeopleCount(clamped);
  };

  // String mapper functions from original code
  const getVisitorTypeString = (val) => (val === 'ugandan' ? 'Ugandan Local' : 'International Visitor');
  const getTravelerTypeString = (val) => {
    const map = {
      solo: 'Solo Traveler',
      couple: 'Couple',
      family: 'Family with children',
      friends: 'Group of Friends',
      business: 'Business Traveler',
    };
    return map[val] || 'Solo Traveler';
  };
  const getBudgetRangeString = (val) => {
    const map = {
      shoestring: 'Shoestring UGX 500K-1.5M / USD $150-400',
      budget: 'Budget UGX 1.5M-3M / USD $400-800',
      mid: 'Mid Range UGX 3M-6M / USD $800-1600',
      comfortable: 'Comfortable UGX 6M-12M / USD $1600-3200',
      upscale: 'Upscale UGX 12M-20M / USD $3200-5500',
      luxury: 'Luxury UGX 20M+ / USD $5500+',
    };
    return map[val] || 'Mid Range UGX 3M-6M / USD $800-1600';
  };

  const handleSubmit = async () => {
    if (!interests.trim() || isGenerating) return;

    const payload = {
      visitor_type: getVisitorTypeString(visitorType),
      interests: interests,
      days: days,
      preferred_destinations: destinations,
      budget_range: getBudgetRangeString(budget),
      traveler_type: getTravelerTypeString(travelerType),
      number_of_people: peopleCount,
    };

    // let userLocation = null;

    // if (useLocationOverride && navigator.geolocation) {
    //   setIsLocating(true);
    //   try {
    //     userLocation = await new Promise((resolve) => {
    //       navigator.geolocation.getCurrentPosition(
    //         (pos) => {
    //           resolve({
    //             latitude: pos.coords.latitude,
    //             longitude: pos.coords.longitude,
    //             place_name: '',
    //           });
    //         },
    //         (err) => {
    //           console.warn('Geolocation access denied or unavailable:', err);
    //           resolve(null);
    //         },
    //         { timeout: 8000, enableHighAccuracy: true }
    //       );
    //     });
    //   } catch (err) {
    //     console.warn('Location retrieval failed:', err);
    //   } finally {
    //     setIsLocating(false);
    //   }
    // }

    onGenerate(payload);
  };

  return (
    <>
      {/* 1. Primary Textarea: Travel Interests (Full Row) */}
      <div className="wg-item item-full">
        <WidgetCard
          title="Your Travel Interests"
        //   actions={
        //     <button className="wg-action" aria-label="Start voice input">
        //       <IconMic />
        //     </button>
        //   }
        >
          <div className="wg-input-row">
            <label className="visually-hidden" htmlFor="travel-interests">
              Your Travel Interests
            </label>
            <textarea
              id="travel-interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Tell us what excites you! E.g. gorilla trekking, wildlife safaris, Nile rafting, cultural experiences..."
            />
          </div>
        </WidgetCard>
      </div>

      {/* 2. Primary Textarea: Destinations (Full Row) */}
      <div className="wg-item item-full">
        <WidgetCard
          title="Which destinations interest you most?"
        //   actions={
        //     <button className="wg-action" aria-label="Start voice input">
        //       <IconMic />
        //     </button>
        //   }
        >
          <textarea
            value={destinations}
            onChange={(e) => setDestinations(e.target.value)}
            placeholder="E.g., Bwindi for gorillas, Murchison Falls, Jinja for rafting, Queen Elizabeth Park..."
          />
        </WidgetCard>
      </div>

      {/* Row 1: Local/Visitor + Traveler Type */}
      <div className="wg-item item-half">
        <WidgetCard title="Are you a local or visitor?">
          <div className="wg-select">
            <select value={visitorType} onChange={(e) => setVisitorType(e.target.value)}>
              <option value="ugandan">Ugandan Local</option>
              <option value="visitor">International Visitor</option>
            </select>
          </div>
        </WidgetCard>
      </div>

      <div className="wg-item item-half">
        <WidgetCard title="Traveler Type">
          <div className="wg-select">
            <select value={travelerType} onChange={(e) => setTravelerType(e.target.value)}>
              <option value="solo">Solo Traveler</option>
              <option value="couple">Couple</option>
              <option value="family">Family with children</option>
              <option value="friends">Group of Friends</option>
              <option value="business">Business Traveler</option>
            </select>
          </div>
        </WidgetCard>
      </div>

      {/* Row 2: Trip Duration + Number of People */}
      <div className="wg-item item-half">
        <WidgetCard title="How many days for your trip?">
          <div className="wg-slider-row">
            <input
              type="range"
              min="1"
              max="60"
              value={days}
              onChange={(e) => handleDaysChange(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="60"
              value={days}
              onChange={(e) => handleDaysChange(e.target.value)}
              className="wg-number"
            />
          </div>
        </WidgetCard>
      </div>

      <div className="wg-item item-half">
        <WidgetCard title="Number of People Traveling">
          <div className="wg-slider-row">
            <input
              type="range"
              min="1"
              max="60"
              value={peopleCount}
              onChange={(e) => handlePeopleChange(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="60"
              value={peopleCount}
              onChange={(e) => handlePeopleChange(e.target.value)}
              className="wg-number"
            />
          </div>
        </WidgetCard>
      </div>

      {/* Row 3: Travel Budget */}
      <div className="wg-item item-full">
        <WidgetCard title="Travel Budget Range">
          <div className="wg-select">
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="shoestring">Shoestring UGX 500K-1.5M / USD $150-400</option>
              <option value="budget">Budget UGX 1.5M-3M / USD $400-800</option>
              <option value="mid">Mid Range UGX 3M-6M / USD $800-1600</option>
              <option value="comfortable">Comfortable UGX 6M-12M / USD $1600-3200</option>
              <option value="upscale">Upscale UGX 12M-20M / USD $3200-5500</option>
              <option value="luxury">Luxury UGX 20M+ / USD $5500+</option>
            </select>
          </div>
        </WidgetCard>
      </div>

      {/* Action Button - Full Row */}
      <div className="wg-item item-full wg-action-row">
        <button
          className="wg-btn-primary"
          onClick={handleSubmit}
          disabled={!interests.trim() || isGenerating}
        >
          {isGenerating ? 'Generating Itinerary...' : 'Generate Itinerary'}
        </button>

        {/* Live feedback text under button */}
        {/* {statusMessage && (
          <div className="wg-status-text">
            <span className="wg-spinner" style={{ width: 14, height: 14 }} />
            {statusMessage}
          </div>
        )} */}
      </div>

    </>
  );
}