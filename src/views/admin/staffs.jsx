import React, { useState, useEffect } from "react";
import { UploadOutlined } from '@ant-design/icons';
import {Upload, message } from 'antd';
import axios from "axios";
import '../../assets/css/pagination.css';
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
  Icon,
  ChakraProvider,
} from "@chakra-ui/react";
import {
  MdOutlineApps,
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
  shopNames,
  selectedShopName,
  handleSelectedShopChange,
  updateImg,
}) {
  const imageupload = async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('email', 'lakshmanan.coder@gmail.com');
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

export default function AddManagers() {
  const [selectedShopName, setSelectedShopName] = useState("");
  const [showAddOwnersForm, setShowAddOwnersForm] = useState(false);
  const [assignedShops, setAssignedShops] = useState({});
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
    city: "",
    district: "",
    state: "",
    pincode: "",
    telephone: "",
    assignShops: [],
    shopNames: [],
  });

  const [displayData, setDisplayData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [shopNames, setShopNames] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 10;
  const [img, setImg] = useState("");
  const toggleForm = () => {
    setShowAddOwnersForm(!showAddOwnersForm);
    setEditIndex(null);
    setEditMode(false);
  };

  const handleAssignShopChange = (ownerId, value) => {
    setAssignedShops({
      ...assignedShops,
      [ownerId]: value,
    });
    setSelectedShopName("");
  };
  console.log(editIndex)
  console.log(handleAssignShopChange)
  
  const handleSelectedShopChange = (value) => {
    setSelectedShopName(value);
  };

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
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";

    const requestBody = new FormData();
    requestBody.append("email", "lakshmanan.coder@gmail.com");
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
    requestBody.append("_id", "10");
    if (editMode) {
      requestBody.append("mode", "addOrEditEmployee");
      requestBody.append("_id", ownerData.id);
    } else {
      const requiredFields = ["name", "email", "password", "city", "district", "state", "pincode", "telephone"];
      const missingFields = requiredFields.filter((field) => !ownerData[field]);

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
      }

      requestBody.append("mode", "addOrEditEmployee");
    }

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log(response);
        alert(editMode ? "Staff updated successfully!" : "Staff added successfully!");
        window.location.reload();
      } else {
        alert(`Failed to ${editMode ? "update" : "add"} shop. Please try again later.`);
      }
    } catch (error) {
      console.error(`Error ${editMode ? "updating" : "adding"} staff:`, error);
      alert(`An error occurred. Please try again later.`);
    }
  };

  const fetchOwnersData = async () => {
    const authToken = localStorage.getItem("token");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = {
      email: "lakshmanan.coder@gmail.com",
      token: authToken,
      mode: "getAllEmployees",
    };

    try {
      const response = await axios.post(apiUrl, new URLSearchParams(data).toString(), {
        headers: headers,
      });

      if (response.status === 200) {
        console.log(response);
        setDisplayData(response.data.data);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  const fetchShopNames = async () => {
    const authToken = localStorage.getItem("token");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = {
      email: "lakshmanan.coder@gmail.com",
      token: authToken,
      mode: "getAllShops",
    };

    try {
      const response = await axios.post(apiUrl, new URLSearchParams(data).toString(), {
        headers: headers,
      });

      if (response.status === 200) {
        console.log(response);
        setShopNames(response.data.data.map((shop) => shop.name)); 
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
      fetchShopNames(); 
    }
  }, [showAddOwnersForm]);

  let displayDataKeys = [];
  if (displayData.length > 0) {
    displayDataKeys = Object.keys(displayData[0]);
  }

  const handleEditClick = (index) => {
    setOwnerData(displayData[index]);
    setEditIndex(index);
    setEditMode(true);
    setShowAddOwnersForm(true);
  };

  const handleDeleteShop = async (shopId, ownerId) => {
    const authToken = localStorage.getItem("token");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";

    const requestBody = {
      email: "lakshmanan.coder@gmail.com",
      token: authToken,
      mode: "deleteEmployee",
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
        console.log(response);
        alert("Staff deleted successfully!");
        window.location.reload();
      } else {
        alert("Failed to delete Staff. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("An error occurred while deleting the shop. Please try again later.");
    }
  };

  const handleDeleteClick = (shopId) => {
    handleDeleteShop(shopId);
  };

  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(displayData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  console.log(pageCount)
  console.log(changePage)
  const displayDataSliced = displayData.slice(pagesVisited, pagesVisited + itemsPerPage);

  return (
    <ChakraProvider>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Button
          backgroundColor="#E130E4"
          color="white"
          rounded="full"
          size="md"
          style={{ outline: "none" }}
          _focus={{ outline: "none" }}
          onClick={toggleForm}
        >
          {showAddOwnersForm ? (
            <Icon as={MdOutlineApps} style={{ fontSize: "28px" }} />
          ) : (
            <Icon as={MdOutlineGroupAdd} style={{ fontSize: "28px" }} />
          )}
         </Button>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#8D8A99",
          }}
        >
          {showAddOwnersForm ? "Display/Edit Staffs" : "Add Staffs"}
        </p>
        <br />

        {showAddOwnersForm && (
          <OwnerForm
            formData={ownerData}
            handleInputChange={handleInputChange}
            handleUploadClick={handleUploadClick}
            editMode={editMode}
            shopNames={shopNames}
            selectedShopName={selectedShopName}
            handleSelectedShopChange={handleSelectedShopChange}
            updateImg={(imgValue) => setImg(imgValue)}
          />
        )}

        {!showAddOwnersForm && (
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                {displayDataKeys.map((key, index) => (
                  <Th key={index}>{key}</Th>
                ))}
                <Th>EDITSTAFFS</Th>
                <Th>DELETESTAFFS</Th>
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
            {/* Use Ant Design's Pagination component */}
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
