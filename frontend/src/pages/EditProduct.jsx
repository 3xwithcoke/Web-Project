import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetailsApi, updateProductApi } from "../services/api";
import toast from "react-hot-toast";
import AdminCard from "../component/dashboard/AdminCard";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    images: [],
    brand: "",
    model: "",
    movement_type: "",
    case_material: "",
    water_resistance: "",
    warranty: "",
    thumbnail: null,
  });

  const categories = ["Men", "Women", "Smart Watches", "Luxury", "Limited Edition"];

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductDetailsApi(id);
      if (res.data.success) {
        const product = res.data.product;
        setFormData({
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice || "",
          stock: product.stock,
          images: product.images || [],
          brand: product.brand || "",
          model: product.model || "",
          movement_type: product.movement_type || "",
          case_material: product.case_material || "",
          water_resistance: product.water_resistance || "",
          warranty: product.warranty || "",
          thumbnail: null,
        });
        setPreview(product.thumbnail);
      } else {
        toast.error("Product not found");
        navigate("/addproduct");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
      navigate("/addproduct");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail") {
      setFormData({ ...formData, thumbnail: files[0] });
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(files[0]);
      }
    } else if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, category, price, stock, description, brand, model } = formData;
    if (!name || !category || !price || !stock || !description || !brand || !model) {
      toast.error("Please fill all required fields (Name, Category, Price, Stock, Description, Brand, Model)");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }

      if (Array.isArray(formData.images)) {
        formData.images.forEach((img) => {
          if (img instanceof File) {
            data.append("images", img);
          }
        });
      }

      data.append("name", name);
      data.append("category", category);
      data.append("description", description);
      data.append("price", Number(price));
      data.append("stock", Number(stock));
      data.append("brand", brand);
      data.append("model", model);
      data.append("movement_type", formData.movement_type);
      data.append("case_material", formData.case_material);
      data.append("water_resistance", formData.water_resistance);
      data.append("warranty", formData.warranty);
      
      if(formData.oldPrice !== "" && formData.oldPrice !== null) {
        data.append("oldPrice", Number(formData.oldPrice));
      }

      const response = await updateProductApi(id, data);

      if (response.data.success) {
        toast.success("Masterpiece updated successfully");
        navigate("/addproduct");
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 bg-black min-h-screen text-white uppercase tracking-widest">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-72 flex-shrink-0 md:sticky md:top-6">
          <AdminCard />
        </div>

        <div className="flex-1">
          <div className="bg-black p-8 border border-gray-900 shadow-2xl mb-10">
            <h1 className="text-3xl font-serif font-light mb-8 tracking-tight">Edit Masterpiece</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Movement Type</label>
                  <input
                    type="text"
                    name="movement_type"
                    value={formData.movement_type}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Case Material</label>
                  <input
                    type="text"
                    name="case_material"
                    value={formData.case_material}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Water Resistance</label>
                  <input
                    type="text"
                    name="water_resistance"
                    value={formData.water_resistance}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Warranty</label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleChange}
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-gray-950 border border-gray-900 rounded-none p-4 text-sm focus:border-white transition-colors"
                    required
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500">Thumbnail Image</label>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-gray-200"
                    />
                    {preview && (
                      <img src={preview} alt="Preview" className="h-32 w-32 object-cover border border-gray-800 grayscale" />
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500">Gallery Images</label>
                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => navigate("/addproduct")}
                  className="flex-1 border border-gray-800 text-gray-500 px-6 py-4 text-xs uppercase tracking-widest hover:text-white hover:border-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-black px-6 py-4 text-xs font-medium uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-20"
                >
                  {loading ? "Perfecting..." : "Update Masterpiece"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
