import { ReactNode } from "react";
import KambazNavigation from "./navigation";
import "./styles.css";

export default function kambazLayout({ children }: Readonly < { children : ReactNode} > ) {
    return (
        <div id = "wd-kambaz">
            <div className = "d-flex" >
                <div>
                    <KambazNavigation />
                </div>
                <div className = "wd-main-content-offset p-3 flex-fill" >
                    { children }
                </div>
            </div>
        </div>
    );
}
