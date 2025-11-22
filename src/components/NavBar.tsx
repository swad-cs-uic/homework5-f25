import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav
      style={{
        padding: "1rem",
        marginBottom: "1rem",
        fontSize: "1.2rem",
      }}
    >
      <Link to="/" style={{ marginRight: "1rem" }}>
        Challenge 1
      </Link>
      <Link to="/challenge2" style={{ marginRight: "1rem" }}>
        Challenge 2
      </Link>
      <Link to="/challenge3" style={{ marginRight: "1rem" }}>
        Challenge 3
      </Link>
      <Link to="/challenge4" style={{ marginRight: "1rem" }}>
        Challenge 4
      </Link>
    </nav>
  );
}
