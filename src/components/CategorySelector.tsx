// components/CategorySelector.tsx

interface Category {
  name: string;
  minHizb: number;
  maxHizb: number;
}

interface CategorySelectorProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onSelectCategory(category)}
          className="bg-white border-2 border-emerald-500 rounded-lg p-6 text-center hover:bg-emerald-50 transition duration-300 shadow-md"
        >
          <h3 className="text-xl font-bold text-emerald-800 mb-2">{category.name}</h3>
          <p className="text-emerald-600">من الحزب {category.minHizb} إلى الحزب {category.maxHizb}</p>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;

