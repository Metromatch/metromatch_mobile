export const authConfigurationInitialValues = {
  isLoggedIn: null,
  token: '',
  expirationTimestamp: null,
  refreshToken: '',
}

type Properties = {
  isLoggedIn: boolean | null,
  token: string,
  expirationTimestamp: number | null,
  refreshToken: string,
}
const authSlice = (set: any) => {
  const Set = (data: Partial<Properties>) => {
    set((state: any) => ({
      authConfiguration: {
        ...state.authConfiguration,
        ...data,
      },
    }));
  };
  return ({
    authConfiguration: authConfigurationInitialValues,
    setIsLoggedIn: (isLoggedIn: boolean) => {
      Set({ isLoggedIn });
    },
    setToken: (token: string) => {
      Set({ token });
    },
    setRefreshToken: (refreshToken: string) => {
      Set({ refreshToken });
    },
    setExpirationTimestamp: (expirationTimestamp: number) => {
      Set({ expirationTimestamp });
    },
    setAuthDetails: (data: Properties) => {
      Set(data);
    },
    clearAuthDetails: () => {
      Set(authConfigurationInitialValues);
    }
  });
};
export default authSlice;