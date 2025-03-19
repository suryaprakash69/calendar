import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CalendarView } from "./components/Calendar/CalendarView";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ minHeight: "100vh", backgroundColor: "#f7fafc" }}>
        <div style={{ height: "100vh" }}>
          <CalendarView />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
