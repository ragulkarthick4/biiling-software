import React, { useState, useEffect } from "react";
import '../../assets/css/pagination.css';
import axios from "axios";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ChakraProvider,
  Button,
  Input,
} from "@chakra-ui/react";
import { Pagination } from "antd";

const OwnersWithShops = () => {
  const [owners, setOwners] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopNames, setShopNames] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);
  const [apiResponse, setApiResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchOwnersData = async () => {
    // Your fetchOwnersData function remains the same.
    const authToken = localStorage.getItem("token");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
 
    const data = {
      email: "lakshmanan.coder@gmail.com",
      token: authToken,
      mode: "getAllOwners",
    };

    try {
      const response = await axios.post(apiUrl, new URLSearchParams(data).toString(), {
        headers: headers,
      });

      if (response.status === 200) {
        setOwners(response.data.data);
      } else {
        console.log("API request failed");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  const fetchShopsData = async () => {
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
        setShops(response.data.data);
        setShopNames(shops.map((shop) => shop.name));
      } else {
        console.log("API request failed");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  useEffect(() => {
    fetchOwnersData();
    fetchShopsData();
  });

  const assignShopsToOwner = async (ownerId, shopIds) => {
    // Your assignShopsToOwner function remains the same.
    const authToken = localStorage.getItem("token");
    const apiUrl = "https://billing.frontendforever.com/admin/v1.php?action=dashboard";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    console.log(shopNames)
    console.log(apiResponse)

    const data = {
      email: "lakshmanan.coder@gmail.com",
      token: authToken,
      mode: "assignOwnerToShop",
      _shop_id: shopIds.join(','),
      _owner_id: ownerId,
    };

    try {
      const response = await axios.post(apiUrl, new URLSearchParams(data).toString(), {
        headers: headers,
      });

      if (response.status === 200) {
        // Handle the API response here, you can update the state with the response data
        setApiResponse(response.data);
      } else {
        console.log("API request failed");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  // Function to handle page changes
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  // Calculate the start and end indices for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter owners based on pagination
  const paginatedOwners = owners.slice(startIndex, endIndex);

  return (
    <ChakraProvider>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Owner</Th>
              <Th>Shops</Th>
              <Th>Assign</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedOwners.map((owner) => (
              <Tr key={owner.id}>
                <Td>{owner.name}</Td>
                <Td>
                  <Input
                    type="text"
                    placeholder="Enter Shop ID"
                    style={{ backgroundColor: 'white' }}
                    onChange={(e) =>
                      setSelectedShops(e.target.value.split(','))
                    }
                    value={selectedShops.join(',')}
                  />
                </Td>
                <Td>
                  <Button
                    onClick={() => {
                      assignShopsToOwner(owner.id, selectedShops);
                    }}
                  >
                    Assign
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div className="pagination-container">
        <Pagination
          total={owners.length}
          current={currentPage}
          pageSize={itemsPerPage}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} items`}
          onChange={handlePageChange}
        />
        </div>
      </Box>
    </ChakraProvider>
  );
};

export default OwnersWithShops;
