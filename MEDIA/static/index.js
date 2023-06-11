import App from "./App";
import { createRoot } from 'react-dom/client';
import React from 'react';
import { ProductCard, Navbar, SeperateContactMode, NavbarCartMenu, SearchField, ErrorWindow, ProviderButton, ProfileWindow, SidebarProductCard, NoPayloadSignal, BottomLine, GetCartProducts, GetHost } from "./components";
import AccountLoginRegisterform from "./LoginForm";
import UISideBar from './CustomSidebar';
import { Provider } from 'react-redux'
import { CartProducts, ProductsBase, ResultProductsBase } from "./features/counter/ReduxBase";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { store } from "./app/store";

const container = document.getElementById('root');
const root = createRoot(container);
// CartProducts

// const store = createStore(reducer)


function ArrangeProducts(ProductsProperties){
  var ProductsUpdatePath =  ProductsBase.actions.StoreProducts
  var processedProducts;
  const Base = useSelector(Main=>Main.ProductsPool)
  const SearchBase = useSelector(Main=>Main.ProductsSearchResult)
  const dispatch = useDispatch()
  const host = window.location.host == "localhost:3000" ? "http://127.0.0.1:8000/" : (window.location.protocol+'//'+window.location.host)

  async function RequestProducts(type){

    const request = await fetch(host+"/GetProducts/all/")
    const requestResult = await request.json()
    dispatch(ProductsUpdatePath(requestResult.products))

  }

  React.useEffect(Main=>{RequestProducts()}, [])

  // CPU_details price title image CPU_details GPU_details RAM_details Panel_details

  if (window.location.search){
    processedProducts = SearchBase.Products.map(Each=><ProductCard id={Each.id} title={Each.title} price={Each.price} key={Each.id} image={Each.image} cpu={Each.CPU_details} gpu={Each.GPU_details} ram={Each.RAM_details} panel={Each.Panel_details}/>)
  }

  else {
      processedProducts = Base.Products.map(Each=>
      <ProductCard id={Each.id} title={Each.title} price={Each.price} key={Each.id} image={Each.image} cpu={Each.CPU_details} gpu={Each.GPU_details} ram={Each.RAM_details} panel={Each.Panel_details}/>
    )
  }

  return (

    <div id='ProductsWindow'>

      {processedProducts}

    </div>

  )

}

function MainPageArrangement(WindowProperties){
  const ProductsUpdatePath =  ResultProductsBase.actions.StoreProducts
  const dispatch = useDispatch()

  React.useEffect(Main=>{

  }, [])

  return (

    <div>

      <Navbar/> 
      <SearchField/>
      <UISideBar/>
      <ArrangeProducts/>

    </div>
    
  )
}


function MainPageSearchArrangement(WindowProperties){
  
  const SearchStatusChange =  ResultProductsBase.actions.StatusUpdate

  const dispatch = useDispatch()
  dispatch(SearchStatusChange(true))

  return (

    <div>

      <Navbar/> 
      <SearchField/>
      <UISideBar/>
      <ArrangeProducts/>

    </div>
    
  )

}


root.render(

  <Provider store={store}>

    <BrowserRouter>
      
      <Routes>

          <Route path="/Main" element={<MainPageArrangement />} />
          <Route path="/Main/:str" element={<MainPageArrangement />} />

          <Route path="login/" element={<AccountLoginRegisterform />} />

      </Routes>

    </BrowserRouter>

  </Provider>

)