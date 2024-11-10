import "./App.css";
import { Sidebar } from "./ui";

function App() {
  return (
    <div className="outline h-screen w-full flex">
      <Sidebar />
      <div className="py-3 px-6">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
    </div>
  );
}

export default App;
