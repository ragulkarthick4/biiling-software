
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
          ) : key === "image" ? (
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

export default function Displayowners() {
  const [showAddOwnersForm, setShowAddOwnersForm] = useState(false);
  const [showdisplayOwnersForm, setShowdisplayOwnersForm] = useState(true);
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    telephone: "",
  });

  const [displayData, setDisplayData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [img, setImg] = useState("");
  const history = useHistory();

  const handleButtonClick = () => {
    history.push('/admin/owners/addowners');
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
    requestBody.append("_email", ownerData.email || "");
    requestBody.append("_telephone", ownerData.telephone || "");
    requestBody.append("_password", ownerData.password || "");
    requestBody.append("_pincode", ownerData.pincode || "");
    requestBody.append("_city", ownerData.city || "");
    requestBody.append("_district", ownerData.district || "");
    requestBody.append("_state", ownerData.state || "");
    requestBody.append("_image", img);
    requestBody.append("mode", "addOrEditOwners");
    requestBody.append("_id", ownerData.id);
   
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // console.log(response);
        alert(editMode ? "Owner updated successfully!" : "Owner added successfully!");
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
      mode: "getAllOwners",
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
      mode: "deleteOwner",
      _id: shopId,
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
        alert("Owner deleted successfully!");
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
          <Route path="/admin/owners/addowners">
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
      <p>Add owners</p>
  &nbsp;

       

      
       <br/>
          {"Display/Edit Owners"}
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
                <Th>EDITOWNERS</Th>
                <Th>DELETEOWNERS</Th>
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