import { configureStore } from '@reduxjs/toolkit';
import { WebsiteTranslationPack, ProfileInfo, CustomCounterBase, FetchedProductsBase, AnimatedButtonStates, SideBarButtonsState, CartProducts, ProductsBase, ResultProductsBase, SupportStaffClients } from '../features/counter/ReduxBase';

export const store = configureStore({

  reducer: {

    AdvancedCounter : CustomCounterBase.reducer,
    ProductsBase    : FetchedProductsBase.reducer,
    ProductButtonState: AnimatedButtonStates.reducer,
    SideBarButtons: SideBarButtonsState.reducer,
    UserCartProducts: CartProducts.reducer,
    ProductsPool: ProductsBase.reducer,
    ProductsSearchResult: ResultProductsBase.reducer,
    SupportStaff_Clients: SupportStaffClients.reducer,
    Profile: ProfileInfo.reducer,
    LanguagePack: WebsiteTranslationPack.reducer,
  },
  
});