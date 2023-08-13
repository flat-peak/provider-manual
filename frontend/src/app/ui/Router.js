import {createMemoryRouter,  createHashRouter, Route,} from 'react-router-dom';
import React from 'react';
import TariffStructure from '../../pages/TariffStructure';

import {
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Seasons from '../../pages/Seasons';
import Prices from '../../pages/Prices';

const routes = createRoutesFromElements(
  <Route path="/">
    <Route path="/" element={<TariffStructure side={"import"}/>}/>
    <Route path="/seasons" element={<Seasons/>}/>
    <Route path="/prices" element={<Prices/>}/>
  </Route>
)

// const router = createMemoryRouter(routes);
const router = createHashRouter(routes);

function Router() {
  return (
    <RouterProvider router={router} />
  );
}

export default Router;
