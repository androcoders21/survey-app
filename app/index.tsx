import React, { useEffect, useMemo } from 'react'
import { Box } from '@/components/ui/box'
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { StatusBar } from 'expo-status-bar'
import { Feather } from "@expo/vector-icons"
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useForm,Controller} from 'react-hook-form'
import { loginSchema, LoginType } from '@/utils/validation-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginUserMutation } from '@/redux/api/end-points/user'
import { clearLocal, getFromLocal, storeToLocal } from '@/utils/helper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Redirect, router } from 'expo-router'
import { set } from 'zod'
import { useAppDispatch } from '@/utils/hooks'
import { setUserId, setUserToken } from '@/redux/slices/user'


const Index = () => {
  const [isLoggedIn,setIsLoggedIn] = React.useState<undefined | string>(undefined);
  const [isFetching,setIsFetching] = React.useState(true);
  const dispatch = useAppDispatch();
 

useEffect(() => {
  Promise.all([getFromLocal('@token'),getFromLocal('@userId')]).then(([token,userId])=>{
    if(token && userId){
      setIsLoggedIn(token);
      console.log("TOKEN-->",token,"USERID-->",userId)
      dispatch(setUserToken(token));
      dispatch(setUserId(userId));
    }
  }).catch((error) => { 
    console.log(error);
  }).finally(() => {
    setIsFetching(false);
    });
    // getFromLocal('@token').then((data) => {
    //     if(data){
    //      setIsLoggedIn(data);
         
    //      console.log(data);
    //     }
    //   }).catch((error) => { 
    //     console.log(error);
    //   }).finally(() => {
    //     setIsFetching(false);
    //     });
    },[]);

if(isFetching){
    return(
        <SafeAreaView style={styles.container}>
            <Text>Loading...</Text>
        </SafeAreaView>
    )
}else if(isLoggedIn && !isFetching){
    return(
        <SafeAreaView style={styles.container}>
            <Redirect href='/(tabs)/main' />
        </SafeAreaView>
    )
}
else{
  return (
    <Redirect href='/signin' />
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Index