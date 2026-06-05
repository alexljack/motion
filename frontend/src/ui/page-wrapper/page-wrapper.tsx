import { PropsWithChildren } from "react";

type PageWrapperType = {
  pageName: string;
};

const PageWrapper = ({
  children,
  pageName = "Page Name",
}: PropsWithChildren<PageWrapperType>) => {
  return (
    <div className="p-2 h-full">
      <div className="font-semibold text-xl">{pageName}</div>
      {children}
    </div>
  );
};

export default PageWrapper;
