import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4">Welcome to Finance Tracker</h1>
      <p className="mb-6 text-gray-600">Track your expenses, set budgets, and get smart financial insights.</p>
      {/* TODO: If user is logged in, show summary dashboard instead of login/register links */}
      {/* TODO: Show loading spinner while checking authentication status */}
      {/* TODO: Redirect to /dashboard if user is logged in */}
      {/* TODO: Show welcome message with user's name if logged in */}
      {/* TODO: Show summary of this month's spending if logged in */}
      {/* TODO: Show button to go to dashboard if logged in */}
      {/* TODO: Show button to log out if logged in */}
      <div className="space-x-4">
        <a href="/account/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</a>
        <a href="/account/register" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Register</a>
      </div>
    </div>
  );
}
