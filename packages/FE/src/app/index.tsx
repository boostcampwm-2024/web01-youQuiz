import Router from './routes/Router';
import ToastContainer from '@/shared/ui/toast/ToastContainer';
function App() {
  return (
    <>
      <ToastContainer position="top-center" />
      <Router />
    </>
  );
}

export default App;
