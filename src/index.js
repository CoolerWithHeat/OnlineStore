import App from "./App";
import { createRoot } from 'react-dom/client';
import React from 'react';
import { ChatComponent, ProductsPage, SideBarAdvanced, AdvancedProductCard, IntroHomePage, UserThread, ErrorMessage, ProductCard, StaffClientsMonitor, AdminChatBox, Navbar, SeperateContactMode, NavbarCartMenu, SearchField, ErrorWindow, ProviderButton, ProfileWindow, SidebarProductCard, NoPayloadSignal, BottomLine, GetCartProducts, GetHost } from "./components";
import AccountLoginRegisterform from "./LoginForm";
import UISideBar from './CustomSidebar';
import { Provider } from 'react-redux'
import { CartProducts, ProductsBase, ResultProductsBase } from "./features/counter/ReduxBase";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { store } from "./app/store";
import { each } from "jquery";


const container = document.getElementById('root');
const root = createRoot(container);



function MainPageArrangement(WindowProperties){
  

  return (

    <div id="MainContainerOfProducts">

      <ProductsPage/>
      

    </div>
    
  )

}

function PaymentWindow(){

  const DispatchHandler = CartProducts.actions.UpdateButtonState
  const Bottom_Line = useSelector(Main=>Main.UserCartProducts.BottomLine)
  const UpdateCartProducts = useDispatch()
  const Products = useSelector(Main=>Main.UserCartProducts.Products)
  const TrashIcon = useSelector(Main=>Main.UserCartProducts.TrashIcon)
  const processedProducts = Products.map(each=><SidebarProductCard TrashIcon={TrashIcon} title={each.title} id={each.id} key={each.id} price={each.price} description={each.description} image_url={each.image} gpu={each.GPU_details} cpu={each.CPU_details} panel={each.Panel_details} ram={each.RAM_details}/>)
  const [PaymentID, Update_PaymentID] = React.useState(1)
  
  async function getStyle(){
    await import('./PaymentDropDown.css');
    await import('./SideBarProductsStyles.scss');
  }

  React.useEffect(Main=>{
            
    async function RequestData(){
        const request = await fetch(GetHost()+"/GetUsersCardProducts/", {headers: {Authorization: `Token ${localStorage.getItem('WebKey')}`}})
        const rawData = await request.json()
        UpdateCartProducts(DispatchHandler(rawData.result))
        return rawData.result
    }

    RequestData()
    getStyle()

  }, [])


  function ChangePayment(Element){
    Update_PaymentID(Main=>Element.target.value)
  }

  const PaymentImageIndices = {

    1: 'https://docs.click.uz/wp-content/themes/click_help/assets/images/logo.png',
    2: 'https://help.payme.uz/img/payme-logo.svg'

  }


  return (
    <div id="WholePaymentWindow">
      <ErrorMessage/>

      <div id="PaymentMain">
      <br/>
      <br/>
        <select onChange={ChangePayment} className="image-dropdown" id="PaymentSelect">

          <option value={1} >Click</option>
          <option value={2} >PayMe</option>

        </select>
        
        <br/>
        <br/>
        
        <img src={PaymentImageIndices[PaymentID]} id={`PaymentImage${PaymentID}`}/>
          <br/>
            <span className={Bottom_Line ? "price": 'No_Payload_Message'}>{Bottom_Line ? `${localStorage.getItem('languageID') == 2 ? 'Общий' : 'Total'}: $${Bottom_Line}` : localStorage.getItem('languageID') == 2 ? 
            'В вашей корзине нет товаров' : 'No Products Found In Your Cart'}</span>
          <br/>
        <br/>

        <div id="Products_Window">
          {processedProducts}
        </div>
      </div>
    </div>

  )
}

root.render(
  <Provider store={store}>

    <BrowserRouter>

      <Routes>
        
        <Route path="Main/" element={<MainPageArrangement />} />
        <Route path="Main/:str/" element={<MainPageArrangement />} />
        <Route path="login/" element={<AccountLoginRegisterform />} />
        <Route path="AdminChatBox/:str/" element={<StaffClientsMonitor/>}/>
        <Route path="AdminChatBox/" element={<AdminChatBox NoUsers={true}/>}/>
        <Route path="Payment/" element={<PaymentWindow/>}/>
        <Route path="Home/" element={<IntroHomePage/>}/>
        <Route path="Contact/" element={<SeperateContactMode/>}/>
          
      </Routes>

    </BrowserRouter>

  </Provider>

)