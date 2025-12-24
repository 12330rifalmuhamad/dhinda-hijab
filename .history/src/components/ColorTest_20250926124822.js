// Temporary component to test Tailwind colors
export default function ColorTest() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-soft-pink-800 mb-4">Soft Pink Color Test</h2>
      
      {/* Soft Pink Shades */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-soft-pink-50 p-4 rounded text-center text-soft-pink-900">50</div>
        <div className="bg-soft-pink-100 p-4 rounded text-center text-soft-pink-900">100</div>
        <div className="bg-soft-pink-200 p-4 rounded text-center text-soft-pink-900">200</div>
        <div className="bg-soft-pink-300 p-4 rounded text-center text-soft-pink-900">300</div>
        <div className="bg-soft-pink-400 p-4 rounded text-center text-white">400</div>
        <div className="bg-soft-pink-500 p-4 rounded text-center text-white">500</div>
        <div className="bg-soft-pink-600 p-4 rounded text-center text-white">600</div>
        <div className="bg-soft-pink-700 p-4 rounded text-center text-white">700</div>
        <div className="bg-soft-pink-800 p-4 rounded text-center text-white">800</div>
        <div className="bg-soft-pink-900 p-4 rounded text-center text-white">900</div>
      </div>

      {/* Brand Colors */}
      <div className="grid grid-cols-5 gap-4 mt-8">
        <div className="bg-brand-primary p-4 rounded text-center text-white">Primary</div>
        <div className="bg-brand-secondary p-4 rounded text-center text-white">Secondary</div>
        <div className="bg-brand-accent p-4 rounded text-center text-soft-pink-800">Accent</div>
        <div className="bg-brand-dark p-4 rounded text-center text-white">Dark</div>
        <div className="bg-brand-light p-4 rounded text-center text-soft-pink-800">Light</div>
      </div>

      {/* Test Components */}
      <div className="mt-8 space-y-4">
        <button className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-6 py-3 rounded-lg font-semibold hover:from-brand-secondary hover:to-brand-primary transition-all duration-200">
          Test Button
        </button>
        
        <div className="bg-soft-pink-50 border border-soft-pink-200 rounded-lg p-4">
          <h3 className="text-soft-pink-800 font-semibold">Test Card</h3>
          <p className="text-soft-pink-600 mt-2">This is a test card with soft pink styling.</p>
        </div>
      </div>
    </div>
  );
}
