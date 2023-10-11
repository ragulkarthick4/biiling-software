import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';
import {Upload, message } from 'antd';
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
  MdShoppingBasket
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

export default function AddManagers() {
  const [selectedShopName, setSelectedShopName] = useState("");
  const [showAddOwnersForm, setShowAddOwnersForm] = useState(false);
  const [assignedShops, setAssignedShops] = useState({});
  const [ownerData, setOwnerData] = useState({
    shopId: "",
    name: "",
    description: "",
    images: "",
    price: "",
    commission: "",
    cgst: "",
    sgst: "",
    igst: "",
    productId: ""
  });

  const [displayData, setDisplayData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [shopNames, setShopNames] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [img, setImg] = useState("");
  const itemsPerPage = 10;

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
    requestBody.append("_shop_id", "1");
    requestBody.append("_description", ownerData.description || "");
    requestBody.append("_images", img);
    requestBody.append("_price", ownerData.price || "");
    requestBody.append("_commission", ownerData.commission || "");
    requestBody.append("_cgst", ownerData.cgst || "");
    requestBody.append("_sgst", ownerData.sgst || "");
    requestBody.append("_igst", ownerData.igst || "");
    requestBody.append("_product_id", ownerData.productId || "");

    if (editMode) {
      requestBody.append("mode", "addOrEditProduct");
      requestBody.append("_product_id", ownerData.product_id);
    } else {
      const requiredFields = ["name"];
      const missingFields = requiredFields.filter((field) => !ownerData[field]);

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
      }

      requestBody.append("mode", "addOrEditProduct");
    }

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log(response);
        alert(editMode ? "Product updated successfully!" : "Product added successfully!");
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
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = {
      email: "lakshmanan.coder@gmail.com",
      token: authToken,
      mode: "getAllProductsByShopId",
      _shop_id:"1"
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
      mode: "deleteProduct",
      _product_id: shopId,
      _shop_id: "1"
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
        alert("Product deleted successfully!");
        window.location.reload();
      } else {
        alert("Failed to delete product. Please try again later.");
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
            <Icon as={MdShoppingBasket} style={{ fontSize: "28px" }} />
          )}
        </Button>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#8D8A99",
          }}
        >
          {showAddOwnersForm ? "Display/Edit Products" : "Add Products"}
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
                <Th>EDITPRODUCTS</Th>
                <Th>DELETEPRODUCTS</Th>
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
                      onClick={() => handleDeleteClick(rowData.product_id)}
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
