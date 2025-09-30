export default function GridLayout() {
    return (
        <div id = "wd-css-grid-layout" >
            <div id = "wd-css-left-right-layout" >
                <h2> Grid Layout </h2>
                <div className = "wd-grid-row" >
                    <div className = "wd-grid-col-half-page wd-bg-color-yellow" >
                        <h3> Left Half </h3>
                    </div>
                    <div className = "wd-grid-col-half-page wd-bg-color-blue wd-fg-color-white" >
                        <h3> Right Half </h3>
                    </div>
                </div>
            </div>
            <div id = "wd-css-left-third-right-two-thirds" className = "wd-grid-row" >
                <div className = "wd-grid-col-third-page wd-bg-color-green wd-fg-color-white" >
                    <h3> Left Third </h3>
                </div>
                <div className = "wd-grid-col-two-thirds-page wd-bg-color-red wd-fg-color-white" >
                    <h3> Right Two Thirds </h3>
                </div>
            </div>
            <div id = "wd-css-side-bars" className = "wd-grid-row" >
                <div className = "wd-grid-col-left-sidebar wd-bg-color-yellow" >
                    <h3> Sidebar </h3>
                    <p> This is the left sidebar </p>
                </div>
                <div className = "wd-grid-col-main-content wd-bg-color-blue wd-fg-color-white" >
                    <h3> Main Content </h3>
                    <p> This is the main content. This is the main content. This is the main content. </p>
                </div>
                <div className = "wd-grid-col-right-sidebar wd-bg-color-green wd-fg-color-white" >
                    <h3> Sidebar </h3>
                    <p> This is the right sidebar </p>
                </div>
            </div>
        </div>
    );
}