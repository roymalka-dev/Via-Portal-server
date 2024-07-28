interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export const formatShifts = (
  events: CalendarEvent[]
): Record<string, string[]> => {
  const namesByCategory = events.reduce(
    (acc: Record<string, string[]>, event) => {
      const nameMatch = event.summary.match(/On Call - (.+?) -/);
      const name = nameMatch ? nameMatch[1].trim() : "Unknown";
      const category = event.summary.split(" - ")[2].trim();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(name);
      return acc;
    },
    {}
  );

  return namesByCategory;
};
