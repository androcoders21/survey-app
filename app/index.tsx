import React, { useEffect } from 'react'
import { Text } from '@/components/ui/text'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getFromLocal } from '@/utils/helper'
import { Redirect } from 'expo-router'
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