export const profileInitialValues = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  profilePicture: '',
  bio: '',
  gender: '',
  dob: '',
}

export type ProfileProperties = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
  bio: string;
  gender: string;
  dob: string;
}

const profileSlice = (set: any) => {
  const Set = (data: Partial<ProfileProperties>) => {
    set((state: any) => ({
      profile: {
        ...state.profile,
        ...data,
      },
    }));
  };
  
  return ({
    profile: profileInitialValues,
    setProfileDetails: (data: Partial<ProfileProperties>) => {
      Set(data);
    },
    clearProfileDetails: () => {
      Set(profileInitialValues);
    }
  });
};

export default profileSlice;
