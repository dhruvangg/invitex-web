import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Editor from '@/components/Editor';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Editor />
    </QueryClientProvider>
  );

}

export default App;
