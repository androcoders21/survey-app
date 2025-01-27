import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { getDraftData } from '@/utils/helper';
import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';
import { CombinedSurveyType } from '@/utils/validation-schema';
import { SafeAreaView } from 'react-native-safe-area-context';

const Draft = () => {
  const [draftData, setDraftData] = React.useState<KeyValuePair[] | undefined>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useFocusEffect(
    useCallback(() => {
      getDraftData().then((data) => {
        setDraftData(data ? [...data] : []);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setIsLoading(false);
      });
    }, []));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{
          title: 'All Drafts',
          headerTitle: "All Drafts",
          headerShown: true,
          headerTitleStyle: { fontWeight: '600' },
        }} />
        <Text>Loading...</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: KeyValuePair }) => {
    const key = item[0];
    const valueString = item[1];

    if (!valueString) {
      return null; // Skip rendering this item
    }

    // Parse the JSON string
    const value: CombinedSurveyType = JSON.parse(valueString);

    return (
      <TouchableOpacity activeOpacity={0.6} style={styles.item} onPress={() => router.push(`/draft/draft-details?id=${key}`)}>
        <Text style={styles.title}>Parcel No: {value?.parcelNo || "NA"}</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.details}>Registry No: {value?.registryNo}</Text>
            <Text style={styles.details}>Constructed Date: {value?.constructedDate}</Text>
            <Text style={styles.details}>Respondent Name: {value?.respondentName}</Text>
            <Text style={styles.details}>Pincode: {value?.pincode}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.details}>House No: {value?.houseNo}</Text>
            <Text style={styles.details}>Locality: {value?.locality}</Text>
            <Text style={styles.details}>Colony: {value?.colony}</Text>
            <Text style={styles.details}>City: {value?.city}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{
        title: 'All Drafts',
        headerTitle: "All Drafts",
        headerShown: true,
        headerTitleStyle: { fontWeight: '600' },
      }} />
      <FlatList
        data={draftData}
        renderItem={renderItem}
        keyExtractor={item => item[0]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  item: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderLeftColor: '#05827a',
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
    borderColor: '#05827a',
    borderWidth: 1,
  },
  details: {
    fontSize: 10,
    color: '#555',
  },
  bolddetails: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Draft;