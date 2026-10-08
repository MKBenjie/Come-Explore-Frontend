import React, { useState } from 'react';
import './WidgetGrid.css';

import IconSun from './widgets/IconSun';
import IconMoon from './widgets/IconMoon';
import LocationErrorBanner from './components/LocationErrorBanner';
import FormSection from './components/FormSection';
import OutputSection from './components/OutputSection';

import { useLocation } from './hooks/useLocation';
import { useItineraryStream } from './hooks/useItineraryStream';

export default function WidgetGrid() {
  const [theme, setTheme] = useState('light');
  const [lastPayload, setLastPayload] = useState(null);
  const [locationStatus, setLocationStatus] = useState(''); // Location status feedback state
  const { requireCoordinates, locationError } = useLocation();
  const { startStream, isGenerating, sections, statuses, errors } = useItineraryStream();

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleGenerate = async (formDataPayload) => {
    try {
      setLastPayload(formDataPayload);
      setLocationStatus('Detecting your current location...');
      // 1. Enforce location before triggering the SSE stream
      const userLocation = await requireCoordinates();
      // let userLocation = null;
      // try {
      //   userLocation = await requireCoordinates();
      // } catch (geoErr) {
      //   console.warn('Proceeding without high-accuracy location:', geoErr);
      // }

      // 2. Attach location override to backend payload
      // const finalPayload = {
      //   ...formDataPayload,
      //   user_location_override: userLocation,
      // };

      setLocationStatus('');

      // 3. Initiate SSE connection
      await startStream(formDataPayload, userLocation);
    } catch (err) {
      console.warn('Generation stopped due to location requirement:', err);
    } finally {
      // ALWAYS clear location status regardless of success or failure
      setLocationStatus('');
    }
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleGenerate(lastPayload);
    }
  };

  // Combine stream status or location acquisition status
  const activeStatusMessage = locationStatus || (isGenerating ? 'Generating your personalized itinerary...' : '');

  return (
    <div className="wg-root" data-theme={theme}>
      {/* Header bar with Dark/Light Toggle */}
      <div className="wg-header-bar">
        <h2>Uganda Travel Planner</h2>
        <button className="wg-theme-btn" onClick={toggleTheme} aria-label="Toggle dark/light theme">
          {theme === 'light' ? (
            <>
              <IconMoon /> Dark Mode
            </>
          ) : (
            <>
              <IconSun /> Light Mode
            </>
          )}
        </button>
      </div>

      <div className="wg-grid" id="editor-grid">
        {/* Intro Banner - Full Row */}
        <div className="wg-item item-full wg-intro-card">
          <p>
            <strong>Uganda - the Pearl of Africa</strong> is a land of breathtaking beauty,
            extraordinary wildlife, and warm, welcoming people. Nestled in the heart of East Africa,
            Uganda is home to half the world's mountain gorillas, the legendary source of the Nile,
            mist-covered rainforests, vast savannahs, volcanic peaks, and shimmering lakes. Use this
            planner to craft your perfect journey!
          </p>
        </div>


        {/* <FormSection onGenerate={handleGenerate} isGenerating={isGenerating} /> */}

        {/* Input Form Section */}
        <div className="wg-item item-full">
          <FormSection 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating || Boolean(locationStatus)} 
            statusMessage={activeStatusMessage}
          />
        </div>

        {/* Location Error Warning Banner */}
        {/* <LocationErrorBanner message={locationError} /> */}
        {locationError && (
          <div className="wg-item item-full">
            <LocationErrorBanner message={locationError} />
          </div>
        )}

        {/* <OutputSection
          sections={sections}
          statuses={statuses}
          errors={errors}
          onRetry={handleRetry}
        /> */}
        <div className="wg-item item-full">
          <OutputSection
            sections={sections}
            statuses={statuses}
            errors={errors}
            onRetry={handleRetry}
            isGenerating={isGenerating || Boolean(locationStatus)}
            statusMessage={activeStatusMessage}
          />
        </div>
      </div>
    </div>
  );
}