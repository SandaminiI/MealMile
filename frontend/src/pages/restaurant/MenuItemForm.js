import React, { useEffect,useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth.js'

const MenuItemForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [role, setRole] = useState('');
  const [auth,setAuth] = useAuth();


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Prepare data to be sent to the backend
        const newItem = new FormData();
        newItem.append("name",name);
        newItem.append("description",description);
        newItem.append("price",price);
        newItem.append("category",category);
        newItem.append("isAvailable",isAvailable);
        newItem.append("tags",tags);

        if (image) {
            newItem.append("image", image);
          }
        // Send POST request to add menu item
        const res = await axios.post('http://localhost:8086/api/v1/menuItem/AddMenu', newItem 
        // );
          , {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true // allow cookies to be sent
          });

        console.log(res.data);

        console.log('awaa2')
        if (res.data.success) {
            toast.success(res.data.message);
            //reset the form
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage(null);
            setTags('');
            setIsAvailable(true);
        }else{
            toast.error(res.data.message);
        }
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Access Denied, Unauthorized Access.');
    }
  };

  return (
    <div>
      <h2>Add New Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        {/* Photo Upload */}
        <div className='uploadbox'>
                    <label className="btn btn-outline-secondary col-md-12">
                      {image ? image.name : "Upload Photo"}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        hidden
                      />
                    </label>
                  </div>

                  {/* Display Uploaded Photo */}
                  <div>
                    <div className="mb-3">
                      {image && (
                        <div className="text-center">
                          <img src={URL.createObjectURL(image)} alt="LOst or Found Image" height={"200px"} className="img img-responsive" />
                        </div>
                      )}
                    </div>
                  </div>
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label>Available :</label>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
        </div>
        <button type="submit">Add Menu Item</button>
      </form>
    </div>
  );
};

export default MenuItemForm;
