import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            <div className="flex gap-4">
                <Link to="/builder" className="primary-button w-fit">
                    Build Resume
                </Link>
                <Link to="/upload" className="primary-button w-fit">
                    Analyze Resume
                </Link>
            </div>
        </nav>
    )
}
export default Navbar
