const initialValues = {
    location: null,
  }
  
  type Properties<T> = {
    [key: string]: T,
  }
  const deviceInfoSlice = (set: any) => {
    const Set = (data: Properties<any>) => {
      set((state: any) => ({
        deviceConfiguration: {
          ...state.deviceConfiguration,
          ...data,
        },
      }));
    };
    return ({
      deviceConfiguration: initialValues,
      setLocation: (location: { latitude: number, longitude: number }) => {
        Set({ location });
      }, 
    });
  };
  export default deviceInfoSlice;