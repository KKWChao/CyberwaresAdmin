import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import Spinner from "@/components/Spinner";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // edit and save button functions
  async function saveCategory(e) {
    e.preventDefault();

    const data = {
      name,
      parentCategory,
      properties: properties.map((item) => ({
        name: item.name,
        values: item.values.split(","),
      })),
    };

    // check for edit state and get id
    if (editedCategory) {
      // adding id for put request
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function fetchCategories() {
    axios
      .get("/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .then(setLoading(false));
  }

  async function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);

    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","), // need to rejoin property values if in multi value
      }))
    );
  }

  // using react-sweetalert2 to generate modal for delete prompt
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}`,
        showCancelButton: true,
        cancelButtonTExt: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // function to add properties
  function addProperty() {
    setProperties((previous) => {
      return [...previous, { name: "", values: "" }];
    });
  }

  // function to update property name change
  function handlePopertyNameChange(index, property, newName) {
    setProperties((previous) => {
      const properties = [...previous];
      properties[index].name = newName;
      return properties;
    });
  }
  // function to update property value change
  function handlePopertyValuesChange(index, property, newValue) {
    setProperties((previous) => {
      const properties = [...previous];
      properties[index].values = newValue;
      return properties;
    });
  }

  // function to remove property
  function removeProperty(indexToRemove) {
    setProperties((previous) => {
      return [...previous].filter((property, index) => {
        return index !== indexToRemove;
      });
    });
  }

  useEffect(() => {
    setLoading(true);
    fetchCategories();
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create New Category"}
      </label>

      <form className="" onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            className=""
            type="text"
            placeholder={"Category Name"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <select
            className=""
            value={parentCategory}
            onChange={(e) => {
              setParentCategory(e.target.value);
            }}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((items) => (
                <option value={items._id} key={items._id}>
                  {items.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            className="btn-default text-sm mb-2"
            onClick={addProperty}
            type="button"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  type="text"
                  value={property.name}
                  onChange={(e) =>
                    handlePopertyNameChange(index, property, e.target.value)
                  }
                  placeholder="Property name (ex: color)"
                />
                <input
                  className="mb-0"
                  type="text"
                  onChange={(e) => {
                    handlePopertyValuesChange(index, property, e.target.value);
                  }}
                  value={property.values}
                  placeholder="Value (comma separated)"
                />
                <button
                  className="btn-default"
                  onClick={() => removeProperty(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              type="button"
            >
              Cancel
            </button>
          )}
          <button className="btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <div className="h-1/4 w-full flex justify-center items-center flex-col text-primary rounded-sm">
                <Spinner />
                Loading
              </div>
            )}
            {categories.length > 0 &&
              categories.map((items) => (
                <tr key={items._id} className="border border-top">
                  <td>{items.name}</td>
                  <td>{items?.parent?.name}</td>
                  <td>
                    <button
                      className="btn-default mr-1"
                      onClick={() => {
                        editCategory(items);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-red"
                      onClick={() => deleteCategory(items)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

// sweet alert wrapper
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
