import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import drafts from './dummyd';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

const Draft = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`/draft/draftform?id=${item.id}`)}>
      <Text style={styles.title}>Property No: {item.propertyNo}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.details}>Registry No: {item.registryNo}</Text>
          <Text style={styles.details}>Constructed Date: {item.constructedDate}</Text>
          <Text style={styles.details}>Respondent Name: {item.respondentName}</Text>
          <Text style={styles.details}>Pincode: {item.pincode}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.details}>House No: {item.houseNo}</Text>
          <Text style={styles.details}>Locality: {item.locality}</Text>
          <Text style={styles.details}>Colony: {item.colony}</Text>
          <Text style={styles.details}>City: {item.city}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: 'All Drafts',
        headerTitle: "All Drafts",
        headerShown: true,
        headerTitleStyle: { fontWeight: '700' },
      }} />
      <FlatList
        data={drafts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
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
  bolddetails: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Draft;