import { FaCheck, FaCircle } from "react-icons/fa";

export default function GreenCheckmark() {
    return (
        <span className = "me-1 position-relative d-inline-block" style = {{ width: "2rem", height: "2rem" }}>
            {/* background circle */}
            <FaCircle className = "text-success" style = {{ fontSize: "2rem", lineHeight: 1 }} />
            {/* centered white check */}
            <FaCheck className = "text-white position-absolute top-50 start-50 translate-middle" style = {{ fontSize: "1rem" }} aria-hidden />
        </span>
    );
}