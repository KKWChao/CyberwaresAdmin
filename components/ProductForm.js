import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  stock: existingStock,
  images: existingImages,
  category: assignedCategories,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [stock, setStock] = useState(existingStock || "");
  const [images, setImages] = useState(existingImages || []);
  const [category, setCategory] = useState(assignedCategories || "");
  const [productProperty, setProductProperty] = useState(
    assignedProperties || {}
  );
  const [categories, setCategories] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  async function saveProduct(e) {
    e.preventDefault();

    const data = {
      title,
      description,
      price,
      stock,
      images,
      category,
      properties: productProperty,
    };

    // checking if id exists, if not, send to create product page
    if (_id) {
      // update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  // returning to products page
  if (goToProducts) {
    router.push("/products");
  }

  // function to upload images to bucket
  async function uploadImages(e) {
    const files = e.target?.files;

    if (files?.length > 0) {
      const data = new FormData();

      setIsUploading(true); // loading state

      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });

      setIsUploading(false); // finshed loading
    }
  }

  // function to order images
  function updateImagesOrder(images) {
    setImages(images);
  }

  // finding category for each product
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let categoryInfo = categories.find(({ _id }) => _id === category); // finding selected category
    propertiesToFill.push(...categoryInfo.properties); // add it to a the array

    // to check selected category if has parent category then finds trying to find properties and adding it to array
    while (categoryInfo?.parent?.id) {
      const parentCategory = categories.find(
        ({ _id }) => _id === categoryInfo?.parent?.id
      );

      propertiesToFill.push(...parentCategory.properties);
      // just in case, if parent category then adding it to array
      categoryInfo = parentCategory;
    }
  }

  // setting product property
  function setProductProp(propertyName, value) {
    setProductProperty((previous) => {
      const newProductProperty = { ...previous };
      newProductProperty[propertyName] = value;
      return newProductProperty;
    });
  }

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />

      <label>Category</label>
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option>Uncategorized</option>
        {categories.length > 0 &&
          categories.map((item) => (
            <option value={item._id} key={item._id}>
              {item.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((items) => (
          <div className="" key={items}>
            <label>
              {items.name[0].toUpperCase() + items.name.substring(1)}
            </label>
            <div>
              <select
                value={productProperty[items.name]}
                onChange={(e) => {
                  setProductProp(items.name, e.target.value);
                }}
              >
                {items.values.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        {/* Sortable package for image sorting */}
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {/* Checking for images, if has images then will populate */}
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} className="rounded-lg" alt="" />
              </div>
            ))}
        </ReactSortable>
        {/* Checking if uploading && will set spinner : show image  */}
        {isUploading && (
          <div className="h-24 flex items-center rounded-sm">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border-primary border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Add Images</div>
          <input
            type="file"
            className="hidden items-center"
            onChange={uploadImages}
          />
        </label>
        {!images?.length && (
          <div className="flex items-center p-2 text-primary">
            No photos in this product...
          </div>
        )}
      </div>

      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />

      <label>Price USD</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
      />

      <label>Current Stock</label>
      <input
        type="number"
        placeholder="stock"
        value={stock}
        onChange={(e) => {
          setStock(e.target.value);
        }}
      />

      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}
