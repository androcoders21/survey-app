import { ActivityIndicator, StyleSheet } from 'react-native';;
import { Text } from '@/components/ui/text';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';
import { useAppDispatch } from '@/utils/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/icon';
import Feather from '@expo/vector-icons/Feather';
import { Heading } from '@/components/ui/heading';
import { useGetUserDetailsMutation } from '@/redux/api/end-points/user';
import { useEffect, useState } from 'react';
import { clearSession, formatDate } from '@/utils/helper';
import { setUserId, setUserToken } from '@/redux/slices/user';
import { apiSlice } from '@/redux/api/api-slice';

export default function TabFiveScreen() {
  const dispatch = useAppDispatch();
  const [getUserDetails,{isSuccess,isLoading}] = useGetUserDetailsMutation();
  const [userData,setUserData] = useState<any>({});

  useEffect(()=>{
  ;(async ()=>{
    try {
        const user = await getUserDetails(undefined).unwrap();
        setUserData(user);
        console.log(user)
    } catch (error) {
        console.log("UserError",error);
    }
  })();
  },[])

  const handleLogout = () => {
    clearSession().then(()=>{
      dispatch(setUserToken(""));
      dispatch(setUserId(""));
      dispatch(apiSlice.util.resetApiState());
      router.replace('/signin');
    });
  }
  if(isLoading){
    return (
        <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size="large" />
        </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Avatar size='2xl' className='mt-16 mb-2 bg-indigo-200' >
        {/* <AvatarFallbackText>John Martin</AvatarFallbackText> */}
        {/* <AvatarImage /> */}
        {/* <AvatarBadge /> */}
        <Icon as={()=><Feather name="user" size={60} color="black" />}/>
      </Avatar>
      <Text size='2xl' className='' bold>{userData?.name || "NA"}</Text>
      <Text size='sm' bold >{userData?.email || "NA"}</Text>
      <Text size='sm' bold >{userData?.mobile || "NA"}</Text>
      <Divider className='mb-4 mt-16'/>
       <Box className='w-full px-4'>
        <Heading>Address</Heading>
        <Text size='sm' bold>{userData?.address || "NA"}</Text>
       </Box>
       <Divider className='my-4'/>
       <Box className='w-full px-4'>
        <Heading>Aadhar No.</Heading>
        <Text size='sm' bold>{userData?.aadhar || "NA"}</Text>
       </Box>
       <Divider className='my-4'/>
       <Box className='w-full px-4'>
        <Heading>PAN No.</Heading>
        <Text size='sm' bold>{userData?.pan || "NA"}</Text>
       </Box>
       <Divider className='my-4'/>
       <Box className='w-full px-4'>
        <Heading>Profile Created On</Heading>
        <Text size='sm' bold>{userData?.created_at ? formatDate(userData?.created_at) : "NA"}</Text>
       </Box>
       <Divider className='my-4'/>
      <Button className='mt-6 border-0' size="md" variant="outline" onPress={handleLogout} action="negative">
          <MaterialIcons name="logout" size={24} color="red" />
          <ButtonText className='text-red-500'>Logout</ButtonText>
        </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  }
});
