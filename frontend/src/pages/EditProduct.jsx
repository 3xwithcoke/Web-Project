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
    ingredients: "",
    howToUse: "",
    thumbnail: null,
  });

  const categories = ["Skincare", "Makeup", "Haircare", "Beauty & Cosmetics", "Fragrance"];

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
          ingredients: product.ingredients || "",
          howToUse: product.howToUse || "",
          thumbnail: null, // Keep as null for now (will upload if changed)
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

    const { name, category, price, stock, description } = formData;
    if (!name || !category || !price || !stock || !description) {
      toast.error("Please fill all required fields");
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

      // Append other fields
      data.append("name", name);
      data.append("category", category);
      data.append("description", description);
      data.append("price", Number(price));
      data.append("stock", Number(stock));
      data.append("ingredients", formData.ingredients);
      data.append("howToUse", formData.howToUse);
      if(formData.oldPrice !== "" && formData.oldPrice !== null) {
        data.append("oldPrice", Number(formData.oldPrice));
      }

      const response = await updateProductApi(id, data);

      if (response.data.success) {
        toast.success("Product updated successfully");
        navigate("/addproduct");
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("Only admins can update products");
      } else {
        toast.error(err.response?.data?.message || "Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-72 flex-shrink-0 md:sticky md:top-6">
          <AdminCard />
        </div>

        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-10">
            <h1 className="text-3xl font-semibold mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                >
                  <option value="">Select Category *</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="number"
                  name="price"
                  placeholder="Price (₹) *"
                  value={formData.price}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />
                <input
                  type="number"
                  name="oldPrice"
                  placeholder="Old Price (optional)"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                />

                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity *"
                  value={formData.stock}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Change Thumbnail (Optional)
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Change Gallery Images (Optional)
                  </label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="border rounded-lg p-3 w-full"
                  />
                </div>

                {preview && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium mb-2">Current Thumbnail:</p>
                    <img
                      src={preview}
                      alt="Thumbnail Preview"
                      className="h-40 w-40 object-cover rounded-lg"
                    />
                  </div>
                )}

                <textarea
                  name="description"
                  placeholder="Product Description *"
                  value={formData.description}
                  onChange={handleChange}
                  className="border rounded-lg p-3 md:col-span-2"
                  required
                />
                <textarea
                  name="ingredients"
                  placeholder="Ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  className="border rounded-lg p-3 md:col-span-2"
                />
                <textarea
                  name="howToUse"
                  placeholder="How To Use"
                  value={formData.howToUse}
                  onChange={handleChange}
                  className="border rounded-lg p-3 md:col-span-2"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/addproduct")}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Product"}
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
