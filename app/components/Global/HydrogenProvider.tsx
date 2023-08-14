import React, {useState} from 'react';

export interface IHydrogenContext {
  useDummyData?: boolean;
  setUseDummyData?(value: React.SetStateAction<boolean>): void;
}
export interface IHydrogenProvider extends IHydrogenContext {
  children: any;
}
export const HydrogenContext = React.createContext<IHydrogenContext>({
  useDummyData: false,
  setUseDummyData: (value: boolean) => {},
});
export const HydrogenProvider = ({
  useDummyData,
  setUseDummyData,
  children,
}: IHydrogenProvider) => {
  return (
    <HydrogenContext.Provider
      value={{
        useDummyData,
        setUseDummyData,
      }}
    >
      {children}
    </HydrogenContext.Provider>
  );
};
