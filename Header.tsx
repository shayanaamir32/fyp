import { Link } from "react-router-dom"
import Logo from "../../dist/assets/Logo.png"

function Header() {
  const user = JSON.parse(localStorage.getItem('auth') as string)
  const role = user?.role ?? null;
  return (
    <header className="bg-[#120727] text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={Logo} alt="Event Management Logo" className="h-16 object-contain" />
          <span className="text-3xl font-bold">Event Management System</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              {role && <Link to="/login" onClick={() => localStorage.removeItem('auth')} className="hover:underline">
                logout
              </Link>}
            </li>
            {!role &&
              <> <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Sign Up
                  </Link>
                </li>
              </>
            }
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

