import Router from './routes/Router';
import ToastContainer from '@/features/toast/ui/ToastContainer';
function App() {
  return (
    <>
      <ToastContainer position="top-right" />
      <Router />
    </>
  );
}

export default App;
