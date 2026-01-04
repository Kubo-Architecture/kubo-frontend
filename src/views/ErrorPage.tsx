import HouseError from '../assets/icons/Universal/kubo-empty.svg';

export default function ErrorPage() {
  const errorCode = window.location.pathname.includes('500') ? '500' : '404';
  const errorMessage = errorCode === '500' ? 'Internal server error' : 'Page not found';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Error Icon */}
        <div className="relative inline-block mb-8">
          <img src={HouseError} alt="Error icon" className="w-64 h-64" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-extralight">{errorCode}</span>
          </div>
        </div>

        {/* Error message */}
        <p className="text-xl text-gray-700">{errorMessage}</p>
      </div>
    </div>
  );
}