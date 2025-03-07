import { createFileRoute } from "@tanstack/react-router";
import PageWrapper from "../ui/page-wrapper/page-wrapper";

export const Route = createFileRoute("/")({
  component: Homepage,
});

function Homepage() {
  return (
    <PageWrapper pageName="Dashboard">
      <h3>Welcome Home, Latch!</h3>
      <div className="grid grid-cols-6 grid-rows-6 gap-[5px] w-full h-full p-4">
        <div className="bg-blue-500 col-start-1 col-end-3 row-start-1 row-end-5">
          1
        </div>
        <div className="bg-green-500 col-start-3 col-end-7 row-start-1 row-end-3">
          2
        </div>
        <div className="bg-red-500 col-start-1 col-end-5 row-start-5 row-end-7">
          3
        </div>
        <div className="bg-yellow-500 col-start-5 col-end-7 row-start-3 row-end-7">
          4
        </div>
        <div className="bg-purple-500 col-start-3 col-end-5 row-start-3 row-end-5">
          5
        </div>
        <div></div>
      </div>
    </PageWrapper>
  );
}

export default Homepage;
