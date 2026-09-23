import { useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const baseApiUrl = import.meta.env.VITE_BACKEND_API_URL;
const endpointPath = import.meta.env.VITE_END_POINT_PATH;
const DEFAULT_STREAM_URL = `${baseApiUrl.replace(/\/$/, '')}/${endpointPath}`;

export function useItineraryStream(endpointUrl = DEFAULT_STREAM_URL) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState({
    personalized_itinerary: '',
    cost_breakdown: '',
    cultural_guide: '',
  });

  const [statuses, setStatuses] = useState({
    personalized_itinerary: 'IDLE',
    cost_breakdown: 'IDLE',
    cultural_guide: 'IDLE',
  });

  const [errors, setErrors] = useState({
    personalized_itinerary: null,
    cost_breakdown: null,
    cultural_guide: null,
  });

  const startStream = async (formData, userLocation) => {
    setIsGenerating(true);

    // Reset section states
    setSections({ personalized_itinerary: '', cost_breakdown: '', cultural_guide: '' });
    setStatuses({ personalized_itinerary: 'STREAMING', cost_breakdown: 'STREAMING', cultural_guide: 'STREAMING' });
    setErrors({ personalized_itinerary: null, cost_breakdown: null, cultural_guide: null });

    const payload = {
      ...formData,
      user_location_override: userLocation,
    };

    try {
        // console.log('Starting SSE stream with payload:', payload);
      await fetchEventSource(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(payload),
        async onopen(response) {
          // If the backend returns a non-200 HTTP response code (e.g. 500, 404, 502)
          if (!response.ok) {
            throw new Error(`Failed to connect to backend server (HTTP ${response.status})`);
          }
        },
        onmessage(msg) {
          if (!msg.data) return;
          const eventData = JSON.parse(msg.data);

          if (eventData.event === 'chunk') {
            const { section, delta } = eventData;
            setSections((prev) => ({
              ...prev,
              [section]: (prev[section] || '') + delta,
            }));
          } else if (eventData.event === 'section_done') {
            setStatuses((prev) => ({
              ...prev,
              [eventData.section]: 'DONE',
            }));
          } else if (eventData.event === 'all_done') {
            setIsGenerating(false);
          } else if (eventData.event === 'error') {
            const { section, error_type, message } = eventData;

            if (section === 'master_workflow' || !section) {
              // Master orchestrator failed
              setStatuses({
                personalized_itinerary: 'ERROR',
                cost_breakdown: 'ERROR',
                cultural_guide: 'ERROR',
              });
              setErrors({
                personalized_itinerary: { error_type, message },
                cost_breakdown: { error_type, message },
                cultural_guide: { error_type, message },
              });
            } else {
              setStatuses((prev) => ({
                ...prev,
                [section]: 'ERROR',
              }));
              setErrors((prev) => ({
                ...prev,
                [section]: { error_type, message },
              }));
            }
          }
        },
        onerror(err) {
        //   console.error('SSE Error:', err);
          setIsGenerating(false);
          setStatuses((prev) => ({
            personalized_itinerary: prev.personalized_itinerary === 'DONE' ? 'DONE' : 'ERROR',
            cost_breakdown: prev.cost_breakdown === 'DONE' ? 'DONE' : 'ERROR',
            cultural_guide: prev.cultural_guide === 'DONE' ? 'DONE' : 'ERROR',
        }));

        // Only apply default network error if no specific error was captured via onmessage
        setErrors((prev) => {
            const defaultError = {
            error_type: 'NETWORK_ERROR',
            message: 'Connection lost. Please check your network or try again.',
            };

            return {
            personalized_itinerary: prev.personalized_itinerary || defaultError,
            cost_breakdown: prev.cost_breakdown || defaultError,
            cultural_guide: prev.cultural_guide || defaultError,
            };
        });

          // Throwing or re-throwing stops fetchEventSource from automatically retrying indefinitely
          throw err;
        },
      });
    } catch (err) {
      console.error('Request failed:', err);
      setIsGenerating(false);
    }
  };

  return { startStream, isGenerating, sections, statuses, errors };
}