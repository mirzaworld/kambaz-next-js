import "./index.css";
import Link from "next/link";
import BackgroundColors from "./backgroundColors";
import ForegroundColors from "./foregroundColors";
import Borders from "./borders";
import Paddings from "./paddings";
import Margins from "./margins";
import Corners from "./corners";
import Dimensions from "./dimensions";
import Positions from "./positions";
import Floating from "./float";
import Zintex from "./zindex";
import GridLayout from "./gridLayout";
import Flexi from "./flex";
import ReactIconsSampler from "./reactIcons";

export default function lab2() {
    return (
        <div id = "wd-lab2">
            <h2> Lab 2 - Cascading Style Sheets </h2>
            <h3> Styling with the STYLE attribute </h3>
            <p>
                Style attribute allows configuring look and feel
                right on the element. Although its very convenient.
                It is considered bad practice and you should avoid
                using the style attribute.
            </p>
            <div id="wd-css-id-selectors">
                <h3> ID selectors </h3>

                <p id="wd-id-selector-1">
                    Instead of changing the look and feel of all the
                    elements of the same name, eg., P, we can refer to a specific element by its ID.
                </p>
                
                <p id="wd-id-selector-2">
                    Heres another paragraph using a different ID and a different look and feel.
                </p>
            </div>

            <div id = "wd-css-class-selectors">
                <h3> Class Selectors </h3>

                <p className = "wd-class-selector">
                    Instead of using IDs to refer to elements, you can use an elements CLASS attribute.
                </p>

                <h4 className="wd-class-selector">
                    This heading has the same style as paragraph above.
                </h4>
            </div>

            <div id = "wd-css-document-structure">
                <div className = "wd-selector-1">
                    <h3> Document Structure Selectors </h3>
                    <div className = "wd-selector-2">
                        Selectors can be combined to refer elements in particular
                        places in the document.
                        <p className = "wd-selector-3">
                            This paragraphs red background is referenced as
                            <br />
                            .selector-2 .selector3 <br />
                            meaning the descendant of some ancestor. 
                            <br />
                            <span className = "wd-selector-4">
                                Whereas this span is a direct child of its parent
                            </span>
                            <br />
                            You can combine these relationships to create specific
                            styles deoending on the document structure.
                        </p>
                    </div>
                </div>
            </div>
            {/* Import from foregroundColors.tsx */}
            <ForegroundColors />
            {/* Import from backgroundColors.tsx */}
            <BackgroundColors />
            {/* Import from borders.tsx */}
            <Borders />
            {/* Import from paddings.tsx */}
            <Paddings />
            {/* Import from margins.tsx */}
            <Margins />
            {/* Import from corners.tsx */}
            <Corners />
            {/* Import from dimensions.tsx */}
            <Dimensions />
            {/* Import from positions.tsx*/}
            <Positions />
            {/* Import from zindex.tsx */}
            <Zintex />
            {/* Import from float.tsx */}
            <Floating />
            {/* Import from gridLayout.tsx */}
            <GridLayout />
            {/* Import from flex.tsx */}
            <Flexi />
            {/* React Icons Sampler */}
            <ReactIconsSampler />
            {/* Link back to labs page */}
            <Link href="/labs"> Back </Link>
        </div>
    );

}