import { useQuery } from "@tanstack/react-query";
import calendarServices from "../../services/calendarServices";
import { EventData } from "../../types/calendar";

const useListCalendar = () => {
  const { data, ...rest } = useQuery<EventData[]>({
    queryKey: ["calendar"],
    queryFn: calendarServices.getCalendar, 
  });

  return {
    data: data || [], 
    ...rest,
  };
};

export default useListCalendar;