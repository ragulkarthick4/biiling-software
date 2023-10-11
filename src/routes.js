import React from "react";
import { Route, Switch,Redirect } from "react-router-dom";
import { Icon } from "@chakra-ui/react";
import {
  MdAccountCircle,
  MdOutlineShoppingCart,
  MdShoppingBasket,
  MdPeopleOutline,
  MdPeopleAlt,
  MdOutlinePermIdentity,
} from "react-icons/md";
import AddOwners from "views/admin/owners/addowners";
import Displayowners from "views/admin/owners/displayowners";
import AddShops from "views/admin/shops/addshops";
import DisplayShops from "views/admin/shops/displayshops";
import Managers from "views/admin/managers";
import Staffs from "views/admin/staffs";
import Customers from "views/admin/customers";
import Products from "views/admin/products";
import OwnersWithShops from "views/admin/assign";
import SignInCentered from "views/auth/signIn";

const OwnersRoutes = () => {
  return (
    <Switch>
      <Route path="/admin/owners/addowners" component={AddOwners} />
      <Route path="/admin/owners/displayowners" component={Displayowners} />
      <Redirect from="/admin/owners" to="/admin/owners/addowners" />
    </Switch>
  );
};

const ShopsRoutes = () => {
  return (
    <Switch>
      <Route path="/admin/shops/addshops" component={AddShops} />
      <Route path="/admin/shops/displayshops" component={DisplayShops} />
      <Redirect from="/admin/shops" to="/admin/shops/addshops" />
    </Switch>
  );
};

const routes = [
  {
    name: "Owners",
    layout: "/admin",
    path: "/owners",
    icon: <Icon as={MdOutlinePermIdentity} width="20px" height="20px" color="inherit" />,
    component: OwnersRoutes,
  },
  {
    name: "Managers",
    layout: "/admin",
    path: "/managers",
    icon: <Icon as={MdPeopleAlt} width="20px" height="20px" color="inherit" />,
    component: Managers,
  },
  {
    name: "Shops",
    layout: "/admin",
    path: "/shops",
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: ShopsRoutes
  },
  {
    name: "Staffs",
    layout: "/admin",
    path: "/staffs",
    icon: <Icon as={MdPeopleOutline} width="20px" height="20px" color="inherit" />,
    component: Staffs,
  },
  {
    name: "Customers",
    layout: "/admin",
    path: "/customers",
    icon: <Icon as={MdPeopleOutline} width="20px" height="20px" color="inherit" />,
    component: Customers,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "/products",
    component: Products,
    icon: <Icon as={MdShoppingBasket} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Assign",
    layout: "/admin",
    path: "/assign",
    icon: <Icon as={MdOutlinePermIdentity} width="20px" height="20px" color="inherit" />,
    component: OwnersWithShops,
  },
  {
    name: "Logout",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdAccountCircle} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
];

export default routes;
