import { ActivityIndicator, FlatList, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { clearSession, storeToLocal } from '@/utils/helper';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useRefereshTokenQuery } from '@/redux/api/end-points/user';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setUserId, setUserToken } from '@/redux/slices/user';
import { apiSlice, baseUrl } from '@/redux/api/api-slice';
import { PressTypes, SurveyDetailsType } from '@/utils/types';
import { setSlectedSurvey } from '@/redux/slices/survey';
import axios from "axios";

export default function HomeScreen() {
  const userId = useAppSelector(state => state.user.userId);
  const userToken = useAppSelector(state => state.user.token)
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isFetching, setIsFetching] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const { data: tokenData, refetch: refetchRefereshToken, error: refereshError, isFetching: isTokenFetching } = useRefereshTokenQuery(undefined, { refetchOnFocus: true });
  const [allSurveys, setAllSurveys] = React.useState<any[]>([]);

  useEffect(() => {
    if (tokenData?.access_token) { // Assuming tokenData contains a property named `token`
      storeToLocal('@token', tokenData?.access_token);
      dispatch(setUserToken(tokenData?.access_token));
      console.log("TOKEN REFRESHED", tokenData?.access_token);
    }
  }, [tokenData]);

  const fetchUserSurvey = async () => {
    setIsFetching(true);
    setAllSurveys(() => ([]));
    try {
      const response: any = await axios.get(`${baseUrl}properties?user_id=${userId}&per_page=10&page=${1}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
          "Accept": "application/json"
        }
      });
      setAllSurveys(response?.data?.data || []);
      setTotalPages(response?.data?.last_page || 1);
      setPage(1);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        handleLogout()
        ToastAndroid.show("Session expired, Please Re-login", ToastAndroid.LONG);
      } else {
        ToastAndroid.show(error?.response?.data?.message.toString() || "Some error occured", ToastAndroid.SHORT);
      }
    } finally {
      setIsFetching(false)
    }
  }

  const fetchMoreSurvey = async (pageNo: number) => {
    try {
      const response: any = await axios.get(`${baseUrl}properties?user_id=${userId}&per_page=10&page=${pageNo}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
          "Accept": "application/json"
        }
      });
      setAllSurveys((prevData) => ([...prevData, ...response?.data?.data || []]));
    } catch (error: any) {
      if (error?.response?.status === 401) {
        handleLogout()
        ToastAndroid.show("Session expired, Please Re-login", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(error?.response?.data?.message.toString() || "Some error occured", ToastAndroid.SHORT);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log("UNDER FOCUS EFFECT");
      refetchRefereshToken();
      fetchUserSurvey();
      return () => {
        console.log('This route is now unfocused.');
        setIsLoading(false);
      };
    }, [])
  );

  const handleLogout = () => {
    clearSession().then(() => {
      console.log("Session Cleared");
    dispatch(setUserToken(""));
    dispatch(setUserId(""));
    dispatch(apiSlice.util.resetApiState());
    router.replace('/signin');
    });
  }

  const handleView = (item: SurveyDetailsType, type: PressTypes) => {
    console.log("SELECTED SURVEY", item.ward_name);
    dispatch(setSlectedSurvey(item));
    if (type === PressTypes.EDIT) {
      router.navigate("/form/edit");
    } else {
      router.navigate("/details/survey-details");
    }
  }

  // const renderItem = ({ item: surveyItem }: { item: SurveyDetailsType }) => {
  //   return (
  //     <Box className='my-2 border border-slate-400 bg-gray-300 rounded-xl'>
  //       <Box className=' bg-white border-b border-slate-400 p-2 rounded-xl'>
  //         <HStack>
  //           <Text size='sm' bold className='w-3/12'>Id :</Text>
  //           <Text size='sm' className='w-3/12'>{surveyItem.id}</Text>
  //           <Text size='sm' bold className='w-3/12'>Parcel Id :</Text>
  //           <Text size='sm' className='w-3/12'>{surveyItem?.udf3 || "NA"}</Text>
  //         </HStack>
  //         {[{ key: "Owner Name", value: "nameOfOwner" }, { key: "Mobile No.", value: "mobile" }, { key: "Address", value: "address_of_residence" }, { key: "City", value: "city" }, { key: "YOC", value: "year_of_construction" }]
  //           .map((item, index) => (
  //             <HStack key={item.key}>
  //               <Text size='sm' bold className='w-3/12'>{item.key} :</Text>
  //               <Text size='sm' className='w-9/12'>{String(surveyItem?.[item.value as keyof SurveyDetailsType] || "NA")}</Text>
  //             </HStack>
  //           ))}
  //         <HStack>
  //           <Text size='sm' bold className='w-3/12'>Created at :</Text>
  //           <Text size='sm' className='w-9/12'>{surveyItem?.created_at ? formatDate(surveyItem.created_at) : "NA"}</Text>
  //         </HStack>
  //       </Box>
  //       <HStack className='w-full bg-gray-300 rounded-b-xl px-2'>
  //         {/* <TouchableOpacity onPress={() => handleView(surveyItem, PressTypes.EDIT)} className='w-6/12 py-2'><Text className='text-center' size='sm' bold>Edit <Icon as={() => <Feather name="edit" size={15} />} size="md" /></Text></TouchableOpacity>
  //         <Divider orientation='vertical' className='bg-gray-500 ' /> */}
  //         <TouchableOpacity onPress={() => handleView(surveyItem, PressTypes.VIEW)} className='w-full py-2'><Text className='text-center' size='sm' bold>View <Icon as={() => <Feather name="eye" size={15} />} size="md" /></Text></TouchableOpacity>
  //       </HStack>
  //     </Box>
  //   )
  // };

   const renderItem = ({ item }: { item: any }) => (
      <TouchableOpacity activeOpacity={0.7} style={styles.item} className='mx-3' onPress={() => router.push(`/details/survey?id=${item.id}`)}>
        <Text style={styles.title}>Parcel No: {item?.parcelNo || "NA"}</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.details}>Registry No: {item?.registryNo || "NA"}</Text>
            <Text style={styles.details}>Constructed Date: {item?.constructedDate || "NA"}</Text>
            <Text style={styles.details}>Respondent Name: {item?.respondentName || "NA"}</Text>
            <Text style={styles.details}>Pincode: {item.pincode}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.details}>House No: {item?.houseNo || "NA"}</Text>
            <Text style={styles.details}>Locality: {item?.locality || "NA"}</Text>
            <Text style={styles.details}>Colony: {item?.colony || "NA"}</Text>
            <Text style={styles.details}>City: {item?.city || "NA"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );

  const handleLoadMore = () => {
    console.log("LOAD MORE");
    console.log("PAGE--->", page, "TOTAL PAGES---->", totalPages);
    if (isFetching || isLoading || page > totalPages) return;
    setIsLoading(true);
    fetchMoreSurvey(page + 1);
    setPage((prevPage) => prevPage + 1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Box className='bg-white relative w-full py-3'>
        <Heading size='2xl' className='text-center'>Surveys</Heading>
      </Box>
      {isFetching ? <Box style={styles.container}><ActivityIndicator size={'large'} /></Box> : <Box className='w-full py-2'>
        <FlatList
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          onEndReached={isFetching ? undefined : handleLoadMore}
          onEndReachedThreshold={0.9}
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
    paddingBottom: 10,
  },
  item: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderLeftColor: '#FF7100',
    borderRightColor: '#ddd',
    borderTopColor: '#ddd',
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    marginBottom: 5,
    padding: 2,
    borderRadius: 5,
    paddingLeft: 5,
    borderColor: '#FFDDC1',
    borderWidth: 1,
  },
  details: {
    fontSize: 10,
    color: '#555',
  },
});
