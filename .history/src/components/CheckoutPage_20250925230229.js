// Di dalam komponen CheckoutPage
const [shippingOptions, setShippingOptions] = useState([]);
const [selectedShipping, setSelectedShipping] = useState(null);

const handleCheckShipping = async () => {
  // Anda perlu logic untuk mendapatkan ID kota dari `formData.city`
  const destinationId = '444'; // Contoh: ID untuk Surabaya
  const totalWeight = cartItems.reduce((total, item) => total + (item.weight || 200) * item.quantity, 0); // Asumsi berat 200g per item

  try {
    const response = await fetch('/api/shipping-cost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: destinationId, weight: totalWeight, courier: 'jne' })
    });
    const data = await response.json();
    if (data && data[0] && data[0].costs) {
      setShippingOptions(data[0].costs);
    }
  } catch (error) {
    console.error("Gagal cek ongkir:", error);
  }
};

// Tambahkan tombol ini di bawah input kota di JSX Anda
<button type="button" onClick={handleCheckShipping} className="mt-2 bg-gray-200 px-4 py-2 rounded-md">Cek Ongkir</button>

// Tampilkan opsi ongkir jika sudah ada
{shippingOptions.length > 0 && (
  <div>
    <h3 className="font-semibold mt-4">Pilih Opsi Pengiriman:</h3>
    {shippingOptions.map(option => (
      <div key={option.service}>
        <input type="radio" name="shipping" id={option.service} onChange={() => setSelectedShipping(option.cost[0].value)} />
        <label htmlFor={option.service}> {option.service} - Rp {option.cost[0].value.toLocaleString('id-ID')} ({option.cost[0].etd} hari)</label>
      </div>
    ))}
  </div>
)}