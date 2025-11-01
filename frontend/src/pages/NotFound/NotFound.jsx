import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <h1>404 - Page Not Found</h1>
            <Link to="/">Click here to go Home</Link>
        </>
    );
}