export const authConfigurationInitialValues = {
  isLoggedIn: false,
  accessToken: '',
  accessTokenExpiresAt: '',
  refreshToken: '',
  refreshTokenExpiresAt: '',
  userId: ''
}

type Properties = {
  isLoggedIn: boolean,
  accessToken: string,
  accessTokenExpiresAt: string,
  refreshToken: string,
  refreshTokenExpiresAt: string,
  userId: string
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
    setAccessToken: (accessToken: string) => {
      Set({ accessToken });
    },
    setRefreshToken: (refreshToken: string) => {
      Set({ refreshToken });
    },
    setAccessTokenExpiresAt: (accessTokenExpiresAt: string) => {
      Set({ accessTokenExpiresAt });
    },
    setRefreshTokenExpiresAt: (refreshTokenExpiresAt: string) => {
      Set({ refreshTokenExpiresAt });
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