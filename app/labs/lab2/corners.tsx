export default function Corners() {
    return (
        <div id = "wd-css-borders">
            <h3> Rounded Corners </h3>
            <p className = "wd-rounded-corners-top wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
                Rounded Corners On The Top
            </p>
            <p className = "wd-rounded-corners-bottom wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
                Rounded Corners At The Bottom 
            </p>
            <p className = "wd-rounded-corners-all-around wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
                Rounded Corners All Around
            </p>
            <p className = "wd-rounded-corners-inline wd-border-thin wd-border-blue wd-border-solid wd-padding-fat">
                Different Rounded Corners
            </p>
        </div>
    );
}