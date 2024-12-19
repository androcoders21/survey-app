import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { clearLocal, formatDate, storeToLocal } from '@/utils/helper';
import { useFetchSurveysQuery, useFetchUserServeyQuery } from '@/redux/api/end-points/survey';
import { IconSymbol } from '@/components/ui/IconSymbol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useRefereshTokenQuery } from '@/redux/api/end-points/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setUserId, setUserToken } from '@/redux/slices/user';
import { set } from 'react-hook-form';
import { apiSlice } from '@/redux/api/api-slice';
import { SurveyType } from '@/utils/validation-schema';
import { SurveyDetailsType } from '@/utils/types';
import { setSlectedSurvey } from '@/redux/slices/survey';
import { Feather } from '@expo/vector-icons';
import { Divider } from '@/components/ui/divider';

export default function HomeScreen() {
  const userId = useAppSelector(state => state.user.userId);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const { data: userSurveys, isFetching: isUserSurveyFetching, error: userSurveyError, refetch: refetchUserSurvey, endpointName } = useFetchUserServeyQuery({ userId: userId, page: page });
  const { data: tokenData, refetch: refetchRefereshToken, error: refereshError, isFetching: isTokenFetching } = useRefereshTokenQuery(undefined, { refetchOnFocus: true });
  const [allSurveys, setAllSurveys] = React.useState<any[]>([]);
  console.log("USER ID", userId, endpointName);

  useEffect(() => {
    if (userSurveyError) {
      console.log("Error", userSurveyError);
      const error: any = userSurveyError;
      if (error?.status == 401) {
        ToastAndroid.show("Session expired, Please Re-login", ToastAndroid.LONG);
        handleLogout()
      } else {
        ToastAndroid.show("Unable to fetch surveys", ToastAndroid.SHORT);
      }
    }
  }, [userSurveyError])

  useEffect(() => {
    if (tokenData?.access_token) { // Assuming tokenData contains a property named `token`
      storeToLocal('@token', tokenData?.access_token);
      dispatch(setUserToken(tokenData?.access_token));
      console.log("TOKEN REFRESHED", tokenData?.access_token);
    }
  }, [tokenData]);

  // console.log("TOKEN DATA",);
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      refetchUserSurvey();
      refetchRefereshToken();

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log('This route is now unfocused.');
        setPage(() => 1);
        setIsLoading(false);
        setAllSurveys(() => []);
      };
    }, [])
  );

  useEffect(() => {
    console.log("USER SURVEYS");
    if (userSurveys?.survey_forms?.data) {
      setAllSurveys((prevSurveys) => [
        ...prevSurveys,
        ...userSurveys.survey_forms.data,
      ]);
      console.log("ALL SURVEYS");
      setIsLoading(false);
    }
  }, [userSurveys]);

  const handleLogout = () => {
    clearLocal();
    dispatch(setUserToken(""));
    dispatch(setUserId(""));
    dispatch(apiSlice.util.resetApiState());
    router.replace('/signin');
  }

  const handleView = (item: SurveyDetailsType) => {
    dispatch(setSlectedSurvey(item));
    router.navigate("/details/survey-details");
  }

  const renderItem = ({ item: surveyItem }: { item: SurveyDetailsType }) => {
    return (
      <Box className='my-2 border border-slate-400 bg-gray-300 rounded-xl'>
        <Box className=' bg-white border-b border-slate-400 p-2 rounded-xl'>
          {[{key:"Id",value:"id"},{ key: "Owner Name", value: "nameOfOwner" }, { key: "Mobile No.", value: "mobile" }, { key: "Address", value: "address_of_residence" }, { key: "City", value: "city" }, { key: "YOC", value: "year_of_construction" }]
            .map((item, index) => (
              <HStack key={item.key}>
                <Text size='sm' bold className='w-3/12'>{item.key} :</Text>
                <Text size='sm' className='w-9/12'>{surveyItem?.[item.value as keyof SurveyDetailsType] || "NA"}</Text>
              </HStack>
            ))}
            <HStack>
                <Text size='sm' bold className='w-3/12'>Created at :</Text>
                <Text size='sm' className='w-9/12'>{surveyItem?.created_at ? formatDate(surveyItem.created_at) : "NA"}</Text>
              </HStack>
        </Box>
        <HStack className='w-full bg-gray-300 rounded-b-xl p-2'>
          <TouchableOpacity  className='w-6/12'><Text className='text-center' size='sm' bold>Edit <Icon as={() => <Feather name="edit" size={15} />} size="md" /></Text></TouchableOpacity>
          <Divider orientation='vertical' className='bg-gray-500 '/>
          <TouchableOpacity onPress={()=>handleView(surveyItem)} className='w-6/12'><Text className='text-center' size='sm' bold>View <Icon as={() => <Feather name="eye" size={15} />} size="md" /></Text></TouchableOpacity>
        </HStack>
      </Box>
    )
  };

  const handleLoadMore = () => {
    console.log("LOAD MORE");
    console.log("PAGE--->", page, userSurveys?.survey_forms?.last_page);
    if (isUserSurveyFetching || isLoading || page >= userSurveys?.survey_forms?.last_page) return;
    setIsLoading(true);
    setPage((prevPage) => prevPage + 1);
  }

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Welcome!</ThemedText>  
    //     <Text size='lg' className='text-yellow-500' bold>Hello</Text>
    //     <HelloWave />
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
    //     <ThemedText>
    //       Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
    //       Press{' '}
    //       <ThemedText type="defaultSemiBold">
    //         {Platform.select({
    //           ios: 'cmd + d',
    //           android: 'cmd + m',
    //           web: 'F12'
    //         })}
    //       </ThemedText>{' '}
    //       to open developer tools.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
    //     <ThemedText>
    //       Tap the Explore tab to learn more about what's included in this starter app.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
    //     <ThemedText>
    //       When you're ready, run{' '}
    //       <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
    //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
    //     </ThemedText>
    //   </ThemedView>
    // </ParallaxScrollView>
    <SafeAreaView style={styles.container}>
      <Heading size='2xl' className='mb-2 relative'>Surveys</Heading>
      <Box className='absolute top-16 right-6'>
        <Pressable onPress={handleLogout}><Icon as={() => <MaterialIcons name="logout" size={20} color="red" />} size="md" /></Pressable>
      </Box>
      {(isUserSurveyFetching && !isLoading) ? <Box style={styles.container}><ActivityIndicator size={'large'} /></Box> : <Box className='w-full'>
        {/* <ScrollView contentContainerStyle={{paddingBottom:50}}>
        {userSurveys?.survey_forms?.data.map((surveyItem:any, index:number) => (
          <Box key={index} className='bg-gray-300 p-2 my-2 rounded-lg'>
          {[{ key: "Id", value: "id" }, { key: "Owner Name", value: "nameOfOwner" },{key:"Mobile No.",value:"mobile"} ,{ key: "Address", value: "address_of_residence" }, { key: "City", value: "city" }, { key: "YOC", value: "year_of_construction" }, { key: "Created At", value: "created_at" }]
            .map((item, index) => (
              <HStack key={item.key}>
                <Text size='sm' bold className='w-3/12'>{item.key} :</Text>
                <Text size='sm' bold className='w-8/12'>{surveyItem?.[item.value] || "NA"}</Text>
              </HStack>
            ))}
        </Box>
          ))}
        </ScrollView> */}
        <FlatList
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={(item, index) => item?.id?.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={1}
          data={allSurveys}
          renderItem={renderItem}
          ListFooterComponent={() =>
            isLoading ? <ActivityIndicator size="small" /> : null
          }
        />
      </Box>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
});
