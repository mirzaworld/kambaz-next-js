import { ReactNode, Suspense } from "react";
import KambazNavigation from "./navigation";
import "./styles.css";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz">
      <div className="d-flex">
        <div>
          <Suspense fallback={null}>
            <KambazNavigation />
          </Suspense>
        </div>
        <div className="wd-main-content-offset p-3 flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
