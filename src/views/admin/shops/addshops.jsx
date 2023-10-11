import React, { useState} from "react";
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';
import {Upload, message } from 'antd';
import '../../../assets/css/pagination.css';
import { BrowserRouter as Router, Switch, Route,useHistory} from 'react-router-dom';

import {
  FormControl,
  Input,
  Select,
  Box,
  FormLabel,
  Button,
  ChakraProvider,
  Icon
} from "@chakra-ui/react";
import {
  MdOutlineApps,
 } from "react-icons/md";
function OwnerForm({
  formData,
  handleInputChange,
  handleUploadClick,
  editMode,
  updateImg,
}) {

  
  const imageupload = async (file) => {
    const token = localStorage.getItem('token');
    const aemail=localStorage.getItem("aemail");
    const formData = new FormData();
    formData.append('email', aemail);
    formData.append('token', token);
    formData.append('mode', 'uploadImage');
    formData.append('image', file);

    try {
      const response = await axios.post(
        'https://billing.frontendforever.com/admin/v1.php?action=dashboard',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.status === 200) {
        message.success('Image uploaded successfully');
        updateImg(response.data.data.image);
      } else {
        message.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    return false; 
  };
  
  return (
    <form>
      {Object.keys(formData).map((key, index) => (
        <FormControl key={index} id={key}>
          <FormLabel>{key}</FormLabel>
          {key === "sex" ? (
            <Select
              placeholder={`Select ${key}`}
              id={key}
              onChange={handleInputChange}
              value={formData[key]}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          ) : key === "images" ? (
            <Upload
            customRequest={() => ({ abort: () => {} })} 
            beforeUpload={imageupload}
            listType="picture"
          >
            <Button style={{ color: "white", backgroundColor: "#E130E4", fontSize: "14px", padding: "6px 12px",height: "35px",marginBottom:"10px"}}icon={<UploadOutlined />}>Upload</Button>
          </Upload> 
        
          ) : (
            <Input
              type={key === "password" ? "password" : "text"}
              id={key}
              onChange={handleInputChange}
              value={formData[key]}
            />
          )}
        </FormControl>
      ))}

      <br />
      <Button
        style={{ outline: "none" }}
        _focus={{ outline: "none" }}
        backgroundColor="#E130E4"
        color="white"
        onClick={handleUploadClick}
      >
        {editMode ? "Update" : "Upload"}
      </Button>
    </form>
  );
}

export default function AddShops() {

  const history = useHistory();

  const handleButtonClick = () => {
    history.push('/admin/shops/displayshops');
  };

  const showAddOwnersForm = true;
  const [ownerData, setOwnerData] = useState({
    start_time: "",
    end_time: "",
    name: "",
    images: "",
    address: "",
    city: "",
    district: "",
    state: "",
    zipcode: "",
    status: "",
    telephone: "",
    created_at: "",
    updated_at: "",
    owner_id: "",
    openingdays: "",
    ratings_point: "",
    ratings_count: "",
    low_price: "",
    high_price: "",
    description: "",
  });

  const [img, setImg] = useState("");
  const handleInputChange = (e) => {
    const { id, value, files } = e.target;

    if (id === "image") {
      const imageFile = files && files.length > 0 ? files[0] : null;

      setOwnerData({
        ...ownerData,
        image: imageFile,
      });
    } else {
      setOwnerData({
        ...ownerData,
        [id]: value,
      });
    }
  };

  const handleUploadClick = async () => {
    const authToken = localStorage.getItem("token");
    const aemail=localStorage.getItem("aemail");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";

    const requestBody = new FormData();
    requestBody.append("email", aemail);
    requestBody.append("token", authToken);
    requestBody.append("_name", ownerData.name || "");
    requestBody.append("_description", ownerData.description || "");
    requestBody.append("_address", ownerData.address || "");
    requestBody.append("_pincode", ownerData.zipcode || "");
    requestBody.append("_city", ownerData.city || "");
    requestBody.append("_state", ownerData.state || "");
    requestBody.append("_latitude", ownerData.latitude || "");
    requestBody.append("_longitude", ownerData.longitude || "");
    requestBody.append("_district", ownerData.district || "");
    requestBody.append("_phone", ownerData.telephone || "");
    requestBody.append("_openingdays", ownerData.openingdays || "");
    requestBody.append("_start_time", ownerData.start_time || "");
    requestBody.append("_end_time", ownerData.end_time || "");
    requestBody.append("_images", img);
    requestBody.append("_owner_id","4");

   
      const requiredFields = ["name"];
      const missingFields = requiredFields.filter((field) => !ownerData[field]);

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
      }

      requestBody.append("mode", "addOrEditShops");
    
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Shop added successfully!");
        window.location.reload();
      } else {
        alert(`Failed to ${"add"} shop. Please try again later.`);
      }
    } catch (error) {
      console.error(`Error ${"adding"} shop:`, error);
      alert(`An error occurred. Please try again later.`);
    }
  };

  return (
    <ChakraProvider>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#8D8A99",
          }}
        >
        <Router>
        <Switch>
          <Route path="/admin/owners/addshops">
          </Route>
          <Route path="/">
            <Button
            backgroundColor="#E130E4"
            color="white"
            rounded="full"
            size="md"
            style={{ outline: "none" }}
            _focus={{ outline: "none" }}
           onClick={handleButtonClick}
          >
            {<Icon as={MdOutlineApps} style={{ fontSize: "28px" }} />
            }
          
           </Button>
          </Route>
        </Switch>
      </Router>
      <p>Display/Edit Shops</p>
  &nbsp;

       

      
       <br/>


          {"Add Shops"}
        </p>
        <br />

        {showAddOwnersForm && (
          <OwnerForm
            formData={ownerData}
            handleInputChange={handleInputChange}
            handleUploadClick={handleUploadClick}
            updateImg={(imgValue) => setImg(imgValue)}
          />
        )}
      </Box>
    </ChakraProvider>
  );
}
