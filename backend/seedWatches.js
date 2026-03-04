const { sequelize } = require("./database/database");
const Product = require("./models/productModel");

const watches = [
  {
    name: "Rolex Submariner Date",
    brand: "Rolex",
    model: "Submariner",
    category: "Luxury",
    description: "The benchmark among divers' watches, the Submariner Date is an iconic timepiece known for its robustness and elegance.",
    price: 950000,
    stock: 5,
    movement_type: "Automatic",
    case_material: "Oystersteel",
    water_resistance: "300m",
    warranty: "5 Years",
    thumbnail: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Omega Speedmaster Moonwatch",
    brand: "Omega",
    model: "Speedmaster Professional",
    category: "Luxury",
    description: "The first watch worn on the moon. A legendary chronograph featuring the Calibre 3861 manual-winding movement.",
    price: 580000,
    stock: 10,
    movement_type: "Manual",
    case_material: "Stainless Steel",
    water_resistance: "50m",
    warranty: "5 Years",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Patek Philippe Nautilus 5711",
    brand: "Patek Philippe",
    model: "Nautilus",
    category: "Limited Edition",
    description: "The quintessential luxury sports watch with its rounded octagonal bezel and horizontally embossed dial.",
    price: 8500000,
    stock: 1,
    movement_type: "Automatic",
    case_material: "Steel",
    water_resistance: "120m",
    warranty: "2 Years",
    thumbnail: "https://images.unsplash.com/photo-1508685096489-77a46807e624?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    model: "Ultra 2",
    category: "Smart Watches",
    description: "The ultimate sports and adventure watch. Featuring a titanium case, precision dual-frequency GPS, and up to 36 hours of battery life.",
    price: 89900,
    stock: 25,
    movement_type: "Digital",
    case_material: "Titanium",
    water_resistance: "100m",
    warranty: "1 Year",
    thumbnail: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    name: "Audemars Piguet Royal Oak",
    brand: "Audemars Piguet",
    model: "Royal Oak Selfwinding",
    category: "Luxury",
    description: "The Royal Oak is a legendary timepiece that redefined luxury watchmaking with its integrated bracelet and octagonal bezel.",
    price: 4500000,
    stock: 2,
    movement_type: "Automatic",
    case_material: "Steel",
    water_resistance: "50m",
    warranty: "2 Years",
    thumbnail: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop"
  }
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");
    
    for (const watch of watches) {
      const [product, created] = await Product.findOrCreate({
        where: { name: watch.name },
        defaults: watch
      });
      if (created) {
        console.log(`Created: ${watch.name}`);
      } else {
        console.log(`Exists: ${watch.name}`);
      }
    }
    
    console.log("Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
