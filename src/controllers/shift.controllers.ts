import { Request, Response } from "express";
import { calendars } from "../data/calendars";
import { shiftServices } from "../services/shift.services";
import { formatShifts } from "../utils/data.utils";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface CalendarResult {
  name: string;
  events?: CalendarEvent[];
  error: string;
}

interface CalendarData {
  [key: string]: Record<string, string[]> | { error: string };
}

export const shiftControllers = {
  getAllCalendarEvents: async (req: Request, res: Response) => {
    const apiKey = process.env.GOOGLE_API_KEY as string;
    const timeMin = req.query.timeMin as string;
    const timeMax = req.query.timeMax as string;

    try {
      const fetchPromises = calendars.map((calendar) =>
        shiftServices
          .fetchCalendarEvents(calendar.id, apiKey, timeMin, timeMax)
          .then(
            (events: CalendarEvent[]): CalendarResult => ({
              name: calendar.name,
              events,
              error: "",
            })
          )
          .catch(
            (error: any): CalendarResult => ({
              name: calendar.name,
              error: error.message || "An unexpected error occurred",
            })
          )
      );

      const results = await Promise.all(fetchPromises);
      const calendarData: CalendarData = results.reduce(
        (acc: CalendarData, result: CalendarResult) => {
          if (result.events && result.events.length) {
            acc[result.name] = formatShifts(result.events);
          } else {
            acc[result.name] = { error: result.error };
          }
          return acc;
        },
        {}
      );

      res.status(200).json(calendarData);
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to fetch calendar data",
        error: error.message ?? "An unexpected server error occurred",
      });
    }
  },
};
