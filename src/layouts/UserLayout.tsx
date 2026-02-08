import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white shadow-2xl sm:rounded-2xl overflow-hidden min-h-screen relative">
        <Outlet />
      </div>
    </div>
  );
}