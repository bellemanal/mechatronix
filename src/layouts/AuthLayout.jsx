import { Outlet } from 'react-router-dom'

// Auth pages don't use the main Navbar/Footer
// They have their own branding inside the page
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface-0">
      <Outlet />
    </div>
  )
}
