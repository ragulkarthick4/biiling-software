import React, { useState } from "react";
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
import { MdOutlineGroupAdd, MdOutlineApps, MdEdit, MdDelete } from "react-icons/md";

function OwnerForm({ formData, handleInputChange, handleUploadClick }) {
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
        color={"white"}
        onClick={handleUploadClick}
      >
        Upload
      </Button>
    </form>
  );
}

export default function AddOwners() {
  const [showAddOwnersForm, setShowAddOwnersForm] = useState(false);
  const [ownerData, setOwnerData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    zipcode: "",
    telephone: "",
    userplan: "",
    wallet: "",
    dob: "",
    sex: "",
    imageupload: "",
    directinvites: "",
    iosregid: "",
    androidregid: "",
    createddate: "",
    updateddate: "",
  });

  const [displayData, setDisplayData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const toggleForm = () => {
    setShowAddOwnersForm(!showAddOwnersForm);
    setEditIndex(null); // Clear the edit state when switching between Add and Display
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setOwnerData({
      ...ownerData,
      [id]: value,
    });
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    const isAnyFieldEmpty = Object.values(ownerData).some(
      (value) => value === ""
    );
    if (isAnyFieldEmpty) {
      alert("Please fill in all fields before uploading.");
    } else {
      if (editIndex !== null) {
        // Editing an existing item
        const updatedData = [...displayData];
        updatedData[editIndex] = ownerData;
        setDisplayData(updatedData);
        setEditIndex(null);
      } else {
        // Adding a new item
        setDisplayData([...displayData, ownerData]);
      }
      setOwnerData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        state: "",
        zipcode: "",
        telephone: "",
        userplan: "",
        wallet: "",
        dob: "",
        sex: "",
        imageupload: "",
        directinvites: "",
        iosregid: "",
        androidregid: "",
        createddate: "",
        updateddate: "",
      });
    }
  };

  const handleEditClick = (index) => {
    setOwnerData(displayData[index]);
    setEditIndex(index);
    setShowAddOwnersForm(true);
  };

  const handleDeleteClick = (index) => {
    const updatedData = [...displayData];
    updatedData.splice(index, 1);
    setDisplayData(updatedData);
  };

  const displayCustomers = () => {
    if (displayData.length > 0) {
      return (
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              {Object.keys(ownerData).map((key, index) => (
                <Th key={index}>{key}</Th>
              ))}
              <Th>EDITCUSTOMERS</Th>
              <Th>DELETECUSTOMERS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayData.map((rowData, rowIndex) => (
              <Tr key={rowIndex}>
                {Object.values(rowData).map((cell, cellIndex) => (
                  <Td key={cellIndex}>{cell}</Td>
                ))}
                <Td>
                  <Button
                    onClick={() => handleEditClick(rowIndex)}
                    leftIcon={<MdEdit />}
                  >
                    Edit
                  </Button>
                </Td>
                <Td>
                <Button
                onClick={() => handleDeleteClick(rowIndex)}
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
      );
    }
    else {
      return <p style={{ fontSize: "20px", fontWeight: "bold", color: "#8D8A99" }}>NO RECORDS FOUND!</p>;
    }
  };

  return (
    <ChakraProvider>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Button
          backgroundColor="#E130E4"
          color={"white"}
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
        <p style={{ fontSize: "20px", fontWeight: "bold", color: "#8D8A99" }}>
          {showAddOwnersForm ? "Display/Edit Customers" : "Add Customers"}
        </p>
        <br />

        {showAddOwnersForm && (
          <OwnerForm
            formData={ownerData}
            handleInputChange={handleInputChange}
            handleUploadClick={handleUploadClick}
          />
        )}

        {!showAddOwnersForm && displayCustomers()}
      </Box>
    </ChakraProvider>
  );
}
