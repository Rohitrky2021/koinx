"use client"
import { Provider } from "react-redux";
import store from './../../redux/store';
// import {store} from '@/redux/store'
export default function layout({ children }) {
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
}
