export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tailwind Test Page</h1>
        <p className="text-lg text-gray-600 mb-8">If you can see this styled text, Tailwind is working!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Card 1</h2>
            <p className="text-gray-600">This is a test card with Tailwind styles.</p>
          </div>
          
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Card 2</h2>
            <p>White text on blue background.</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Card 3</h2>
            <p>Gradient background!</p>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Primary Button
          </button>
          
          <button className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  )
}