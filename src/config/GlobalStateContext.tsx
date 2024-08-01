// 在一个单独的文件中，例如 GlobalStateContext.js

import React, { createContext, useContext, useState } from 'react';
import storage, { Storage } from '../storage'

// 创建一个新的 Context
const GlobalContext = createContext<{
  globalState: Storage;
  setGlobalState: React.Dispatch<React.SetStateAction<Storage>>;
}>({
  globalState: storage,
  setGlobalState: () => {},
});

// 创建一个 Provider 组件，用来存储和更新全局状态
export const GlobalStateProvider = ({ children }: any) => {
  const [globalState, setGlobalState] = useState(storage); // initialState 是你的初始状态

  return (
    <GlobalContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalContext.Provider>
  );
};

// 自定义 hook，用来简化在组件中访问全局状态的代码
export const useGlobalState = () => useContext(GlobalContext);
