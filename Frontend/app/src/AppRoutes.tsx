// Routing-Konfiguration und Komponenten-Import
import { RouteObject } from "react-router-dom";
import Home from "./Pages/Home";
import AddShoppingList from "./Components/AddShoppingList.tsx";
import { ViewAllItems } from "./Pages/ViewAllItems";
import ViewAllShoppingLists from "./Pages/ViewAllShoppingLists";
import AddNewItem from "./Components/AddNewItem.tsx";
import { ShoppingListsPage } from "./Components/ShoppingListsPage.tsx";
import ItemsPage from "./Components/ItemsPage.tsx"; // Routing-Konfiguration für die Anwendung
import ItemsInList from "./Components/ItemsInList.tsx";
import AllFavouriteItems from "./Components/AllFavouriteItems.tsx"; // Routing-Konfiguration für die Anwendung
import FindShoppingList from "./Components/FindShoppingList.tsx"; // Routing-Konfiguration für die Anwendung

// Routing-Konfiguration für die Anwendung
const appRoutes: RouteObject[] = [
  { path: "/Home", element: <Home /> },
  { path: "/AddShoppingList", element: <AddShoppingList /> },
  { path: "/addItem", element: <AddNewItem /> },
  { path: "/ViewAllItems", element: <ViewAllItems /> },
  {
    path: "/ItemsPage/:shoppingListId",
    element: <ItemsPage />,
  },
  { path: "/ItemsInList/:listId", element: <ItemsInList /> },
  { path: "/AllFavouriteItems", element: <AllFavouriteItems /> },
  { path: "/FindShoppingList", element: <FindShoppingList /> },
  { path: "/ShoppingLists", element: <ShoppingListsPage /> },
  { path: "/ViewAllShoppingLists", element: <ViewAllShoppingLists /> },
];

export default appRoutes;
