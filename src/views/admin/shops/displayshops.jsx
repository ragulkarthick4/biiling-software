
import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';
import {Upload, message } from 'antd';
import { BrowserRouter as Router, Switch, Route,useHistory} from 'react-router-dom';
import '../../../assets/css/pagination.css';
import {
  FormControl,
  Input,
  Select,
  Box,
  FormLabel,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ChakraProvider,
  Icon
} from "@chakra-ui/react";
import {
  MdEdit,
  MdDelete,
  MdOutlineGroupAdd,
} from "react-icons/md";
import { Pagination } from 'antd';
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

export default function DisplayShops() {
  const [showAddOwnersForm, setShowAddOwnersForm] = useState(false);
  const [showdisplayOwnersForm, setShowdisplayOwnersForm] = useState(true);
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

  const [displayData, setDisplayData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [img, setImg] = useState("");
  const history = useHistory();

  const handleButtonClick = () => {
    history.push('/admin/shops/addshops');
  };
  
  const itemsPerPage = 10;

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
    requestBody.append("mode", "addOrEditShops");
    requestBody.append("_shopId", ownerData.shop_id);
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // console.log(response);
        alert(editMode ? "Shop updated successfully!" : "Shop added successfully!");
        window.location.reload();
      } else {
        alert(`Failed to ${editMode ? "update" : "add"} shop. Please try again later.`);
      }
    } catch (error) {
      console.error(`Error ${editMode ? "updating" : "adding"} shop:`, error);
      alert(`An error occurred. Please try again later.`);
    }
  };

  const fetchOwnersData = async () => {
    const authToken = localStorage.getItem("token");
    const aemail=localStorage.getItem("aemail");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = {
      email: aemail,
      token: authToken,
      mode: "getAllShops",
    };

    try {
      const response = await axios.post(apiUrl, new URLSearchParams(data).toString(), {
        headers: headers,
      });

      if (response.status === 200) {
        // console.log(response);
        setDisplayData(response.data.data);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  useEffect(() => {
    if (!showAddOwnersForm) {
      fetchOwnersData();
  
    }
  }, [showAddOwnersForm]);

  let displayDataKeys = [];
  if (displayData.length > 0) {
    displayDataKeys = Object.keys(displayData[0]);
  }

  const handleEditClick = (index) => {
    setOwnerData(displayData[index]);
    setEditMode(true);
    setShowAddOwnersForm(true);
    setShowdisplayOwnersForm(false);
  };

  const handleDeleteShop = async (shopId, ownerId) => {
    const authToken = localStorage.getItem("token");
    const aemail=localStorage.getItem("aemail");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";

    const requestBody = {
      email: aemail,
      token: authToken,
      mode: "deleteShop",
      _shop_id: shopId,
    };

    try {
      const response = await axios.post(
        apiUrl,
        new URLSearchParams(requestBody).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        // console.log(response);
        alert("Shop deleted successfully!");
        window.location.reload();
      } else {
        alert("Failed to delete shop. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
      alert("An error occurred while deleting the shop. Please try again later.");
    }
  };

  const handleDeleteClick = (shopId) => {
    handleDeleteShop(shopId);
  };

  const pagesVisited = pageNumber * itemsPerPage;
  const displayDataSliced = displayData.slice(pagesVisited, pagesVisited + itemsPerPage);

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
            {<Icon as={MdOutlineGroupAdd} style={{ fontSize: "28px" }} />
            }
          
           </Button>
          </Route>
        </Switch>
      </Router>
      <p>Add Shops</p>
  &nbsp;

       

      
       <br/>
          {"Display/Edit Shops"}
        </p>
        <br />

        {showAddOwnersForm && (
          <OwnerForm
            formData={ownerData}
            handleInputChange={handleInputChange}
            handleUploadClick={handleUploadClick}
            editMode={editMode}
            updateImg={(imgValue) => setImg(imgValue)}
          />
        )}

       {(showdisplayOwnersForm && 
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                {displayDataKeys.map((key, index) => (
                  <Th key={index}>{key}</Th>
                ))}
                <Th>EDITSHOPS</Th>
                <Th>DELETESHOPS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayDataSliced.map((rowData, rowIndex) => (
                <Tr key={rowIndex}>
                  {displayDataKeys.map((key, columnIndex) => (
                    <Td key={columnIndex}>{rowData[key]}</Td>
                  ))}
                  <Td>
                    <Button onClick={() => handleEditClick(rowIndex)} leftIcon={<MdEdit />}>
                      Edit
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      onClick={() => handleDeleteClick(rowData.id)}
                      leftIcon={<MdDelete />}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
                  )} 
        

       {displayData.length > itemsPerPage && (
          <div className="pagination-container">
           
            <Pagination
              current={pageNumber + 1}
              total={displayData.length}
              pageSize={itemsPerPage}
              onChange={(page) => setPageNumber(page - 1)}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
            />
          </div>
       )} 
      </Box>
    </ChakraProvider>
  );
}