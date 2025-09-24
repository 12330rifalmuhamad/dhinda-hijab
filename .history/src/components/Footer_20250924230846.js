// components/Footer.js

export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Dhinda Hijab. All Rights Reserved.</p>
        </div>
      </footer>
    );
  }