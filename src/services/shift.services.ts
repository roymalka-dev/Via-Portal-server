import axios from "axios";

export const shiftServices = {
  fetchCalendarEvents: async (
    calendarId: string,
    apiKey: string,
    timeMin: string,
    timeMax: string
  ): Promise<any> => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}@import.calendar.google.com/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`;
    try {
      const response = await axios.get(url);
      return response.data.items; // Assuming 'items' contains the calendar events
    } catch (error) {
      throw new Error(`Error fetching calendar events: ${error}`);
    }
  },
};
