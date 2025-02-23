import { PropsWithChildren } from "react";

type PageWrapperType = {
  pageName: string;
};

const PageWrapper = ({
  children,
  pageName = "Page Name",
}: PropsWithChildren<PageWrapperType>) => {
  return (
    <div className="p-2">
      <div>{pageName}</div>
      {children}
    </div>
  );
};

export default PageWrapper;
