import { configureStore } from '@reduxjs/toolkit';
import { CustomCounterBase, FetchedProductsBase, AnimatedButtonStates, SideBarButtonsState, CartProducts, ProductsBase, ResultProductsBase } from '../features/counter/ReduxBase';

export const store = configureStore({

  reducer: {

    AdvancedCounter : CustomCounterBase.reducer,
    ProductsBase    : FetchedProductsBase.reducer,
    ProductButtonState: AnimatedButtonStates.reducer,
    SideBarButtons: SideBarButtonsState.reducer,
    UserCartProducts: CartProducts.reducer,
    ProductsPool: ProductsBase.reducer,
    ProductsSearchResult: ResultProductsBase.reducer,
    
  },
  
});
