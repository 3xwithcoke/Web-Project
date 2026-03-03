import { useState, useEffect } from "react";
import { fetchProducts, addProductApi, deleteProductApi } from "../services/api";
import toast from "react-hot-toast";
import AdminCard from "../component/dashboard/AdminCard"
import { useNavigate } from "react-router-dom";

const Addproduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
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
    ingredients: "",
    howToUse: "",
    thumbnail: null,
  });

  const categories = ["Skincare", "Makeup", "Haircare", "Beauty & Cosmetics", "Fragrance"];

  const getProducts = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data.results || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail") {
      setFormData({ ...formData, thumbnail: files[0] });

      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(files[0]);
      } else {
        setPreview(null);
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

    const { name, category, price, stock, description, thumbnail } = formData;
    if (!name || !category || !price || !stock || !description || !thumbnail) {
      toast.error("Please fill all required fields including thumbnail");
      setLoading(false);
      return;
    }
    try {
      const data = new FormData();
      data.append("thumbnail", thumbnail);
      formData.images.forEach((img) => data.append("images", img));

      // append other fields
      data.append("name", name);
      data.append("category", category);
      data.append("description", description);
      data.append("price", price);
      data.append("oldPrice", formData.oldPrice);
      data.append("stock", stock);
      data.append("ingredients", formData.ingredients);
      data.append("howToUse", formData.howToUse);

      const response = await addProductApi(data);

      toast.success("Product added successfully");

      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        oldPrice: "",
        stock: "",
        images: [],
        ingredients: "",
        howToUse: "",
        thumbnail: null,
      });
      setPreview(null);

      setProducts((prev) => [response.data.product, ...prev]);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("You must be logged in to add a product");
        return;
      }
      if (err.response?.status === 403) {
        toast.error(err.response.data.message || "Only admins can add products");
        return;
      }
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProduct = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Are you sure you want to delete this product?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await deleteProductApi(id);
                if (res.data.success) {
                  toast.success("Product deleted");
                  setProducts((prev) => prev.filter(p => p.product_id !== id));
                }
              } catch (err) {
                toast.error(err.response?.data?.message || "Delete failed");
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-72 flex-shrink-0 md:sticky md:top-6">
          <AdminCard />
        </div>

        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-10">
            <h1 className="text-3xl font-semibold mb-6">Add Product</h1>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} className="border rounded-lg p-3" />
                <select name="category" value={formData.category} onChange={handleChange} className="border rounded-lg p-3">
                  <option value="">Select Category *</option>
                  {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
                <input type="number" name="price" placeholder="Price (₹) *" value={formData.price} onChange={handleChange} className="border rounded-lg p-3" />
                <input type="number" name="oldPrice" placeholder="Old Price (optional)" value={formData.oldPrice} onChange={handleChange} className="border rounded-lg p-3" />
                <input type="number" name="stock" placeholder="Stock Quantity *" value={formData.stock} onChange={handleChange} className="border rounded-lg p-3" />

                <input type="file" name="thumbnail" accept="image/*" onChange={handleChange} className="border rounded-lg p-3 md:col-span-2" />
                <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="border rounded-lg p-3 md:col-span-2" />

                {preview && (<img src={preview} alt="Thumbnail Preview" className="h-40 w-full object-cover rounded-lg md:col-span-2" />)}

                <textarea name="description" placeholder="Product Description *" value={formData.description} onChange={handleChange} className="border rounded-lg p-3 md:col-span-2" />
                <textarea name="ingredients" placeholder="Ingredients" value={formData.ingredients} onChange={handleChange} className="border rounded-lg p-3 md:col-span-2" />
                <textarea name="howToUse" placeholder="How To Use" value={formData.howToUse} onChange={handleChange} className="border rounded-lg p-3 md:col-span-2" />
              </div>

              <button type="submit" disabled={loading} className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg">
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>

          </div>

          <h2 className="text-2xl font-semibold mb-4">Product List</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products?.map((p) => (
              <div key={p.product_id} className="bg-white rounded-xl shadow-sm p-4">
                {p.thumbnail && (<img src={p.thumbnail} alt={p.name} className="h-40 w-full object-cover rounded-lg mb-4" />)}
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="mt-1 font-medium">₹{p.price}</p>
                {p.oldPrice && (<p className="text-sm line-through text-gray-400">₹{p.oldPrice}</p>)}
                <p className="text-sm text-gray-600">Stock: {p.stock}</p>
                <p className="text-sm text-gray-600">Description: {p.description}</p>
                {p.ingredients && <p className="text-sm text-gray-600">Ingredients: {p.ingredients}</p>}
                {p.howToUse && <p className="text-sm text-gray-600">How To Use: {p.howToUse}</p>}

                <div className="flex gap-2 mt-4">
                  <button onClick={() => navigate(`/editproduct/${p.product_id}`)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">
                    Edit</button>
                  <button onClick={() => handleDeleteProduct(p.product_id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addproduct;