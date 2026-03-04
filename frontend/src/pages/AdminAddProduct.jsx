import { useEffect, useState } from "react";
import { addProductApi, fetchProducts, deleteProductApi } from "../services/api";
import toast from "react-hot-toast";
import AdminCard from "../component/dashboard/AdminCard";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const AdminAddProduct = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        brand: "",
        model: "",
        movement_type: "Automatic",
        case_material: "Stainless Steel",
        water_resistance: "50m",
        warranty: "2 Years",
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const categories = ["Men", "Women", "Smart Watches", "Luxury", "Limited Edition"];

    const loadProducts = async () => {
        try {
            const { data } = await fetchProducts();
            setProducts(data.results || []);
        } catch (error) {
            toast.error("Failed to retrieve registry");
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => formData.append(key, value));
            if (thumbnail) formData.append("thumbnail", thumbnail);
            images.forEach((img) => formData.append("images", img));

            await addProductApi(formData);
            toast.success("Masterpiece added to collection");

            setForm({
                name: "", category: "", price: "", stock: "", description: "",
                brand: "", model: "", movement_type: "Automatic", 
                case_material: "Stainless Steel", water_resistance: "50m", warranty: "2 Years"
            });
            setThumbnail(null);
            setPreview(null);
            setImages([]);
            loadProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to authenticate addition");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Purge this masterpiece from the registry?")) return;
        try {
            await deleteProductApi(id);
            toast.success("Record purged");
            loadProducts();
        } catch (error) {
            toast.error("Failed to delete record");
        }
    };

    return (
        <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16">
                <div className="h-fit lg:sticky lg:top-20">
                    <AdminCard />
                </div>

                <div className="flex-1 space-y-24">
                    <div className="bg-gray-950/50 border border-gray-900 p-10 md:p-16">
                        <div className="mb-12 space-y-2">
                            <h2 className="text-3xl font-serif font-light tracking-tight italic">Registry Entrance</h2>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">Register a new horological masterpiece</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {[
                                    { name: "name", label: "Masterpiece Name", placeholder: "e.g. Submariner" },
                                    { name: "brand", label: "House / Brand", placeholder: "e.g. Rolex" },
                                    { name: "model", label: "Reference Model", placeholder: "e.g. 126610LN" },
                                    { name: "price", label: "Market Value (₹)", type: "number" },
                                    { name: "stock", label: "Inventory Quantity", type: "number" },
                                ].map(field => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-600">{field.label}</label>
                                        <input
                                            className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white transition-all outline-none"
                                            name={field.name}
                                            type={field.type || "text"}
                                            placeholder={field.placeholder}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                ))}

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-600">Classification</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white transition-all outline-none appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-black">Select Category</option>
                                        {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {[
                                    { name: "movement_type", label: "Movement Calibre" },
                                    { name: "case_material", label: "Case Composition" },
                                    { name: "water_resistance", label: "Pressure Resistance" },
                                    { name: "warranty", label: "Assurance Period" },
                                ].map(field => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-600">{field.label}</label>
                                        <input
                                            className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white transition-all outline-none"
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-gray-600">Historical Description</label>
                                <textarea
                                    className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white transition-all outline-none resize-none"
                                    name="description"
                                    rows="3"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <label className="block space-y-4">
                                        <span className="text-[10px] uppercase tracking-widest text-gray-600">Primary Portrait</span>
                                        <div className="relative group cursor-pointer border border-dashed border-gray-800 p-8 text-center hover:border-white transition-all">
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleThumbnailChange}
                                                required
                                            />
                                            {preview ? (
                                                <img src={preview} className="h-32 mx-auto grayscale" alt="Preview" />
                                            ) : (
                                                <div className="space-y-2">
                                                    <FaPlus className="mx-auto text-gray-800" />
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-700">Upload Image</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                                <div className="flex items-end pb-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-black py-5 text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-gray-200 transition-all shadow-2xl disabled:opacity-20"
                                    >
                                        {loading ? "Authenticating..." : "Commit to Registry"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-12">
                        <div className="flex justify-between items-end border-b border-gray-900 pb-4">
                            <h3 className="text-2xl font-serif font-light tracking-tight italic">Global Masterpiece Registry</h3>
                            <p className="text-[10px] uppercase tracking-widest text-gray-600">{products.length} Authenticated Records</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-900">
                                        <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Portrait</th>
                                        <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Identity</th>
                                        <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Market Value</th>
                                        <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Holdings</th>
                                        <th className="py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-900/50">
                                    {products.map((product) => (
                                        <tr key={product.product_id} className="group hover:bg-gray-950/50 transition-colors">
                                            <td className="py-8">
                                                <div className="w-16 h-20 bg-gray-900 border border-gray-800 overflow-hidden">
                                                    <img
                                                        src={`${API_BASE}${product.thumbnail}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-8">
                                                <p className="text-sm font-light text-white uppercase tracking-wide">{product.name}</p>
                                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">{product.brand} — {product.model}</p>
                                            </td>
                                            <td className="py-8 text-sm font-light tracking-widest">₹{product.price}</td>
                                            <td className="py-8 text-sm font-light text-gray-500">{product.stock} Units</td>
                                            <td className="py-8 text-right">
                                                <div className="flex justify-end gap-8">
                                                    <button
                                                        onClick={() => navigate(`/editproduct/${product.product_id}`)}
                                                        className="text-[10px] uppercase tracking-widest text-white hover:text-gray-400 transition-colors underline underline-offset-8"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.product_id)}
                                                        className="text-[10px] uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors"
                                                    >
                                                        Purge
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddProduct;
