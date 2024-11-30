import React, { useState , useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as NavigationBar from 'expo-navigation-bar';

interface SortingDropdownProps {
  sorting: (value: string) => void;
}

const SortingDropdown = ({ sorting }: SortingDropdownProps) => {
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    sorting(value); // Trigger sorting function
  };

  const sortingOptions = [
    { label: 'Newest', value: 'date_desc' },
    { label: 'Oldest', value: 'date_asc' },
    { label: 'A-Z', value: 'name_asc' },
    { label: 'Z-A', value: 'name_desc' },
  ];

  useEffect(() => {
    async function configureNavigationBar() {
      try {
        // ตั้งค่าพื้นหลังโปร่งใส
        await NavigationBar.setBackgroundColorAsync('#ffffffcc');
        // ตั้งค่าให้ปุ่มใน Navigation Bar เป็นสีอ่อน (หากพื้นหลังเป็นสีเข้ม)
        await NavigationBar.setButtonStyleAsync('dark');
        NavigationBar.setBorderColorAsync("#ffffff");
      } catch (error) {
        console.error('Error configuring Navigation Bar:', error);
      }
    }
  
    configureNavigationBar();
  }, []);

  return (
    <View style={styles.sortingWrapper}>
      <Dropdown
        style={styles.dropdown}
        data={sortingOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Sorting"
        activeColor='rgba(215, 21, 21, 0.5)'
        selectedTextStyle={{ color: 'black' }}
        itemTextStyle={{ color: 'black' }}
        itemContainerStyle={{ backgroundColor: 'white' }}
        value={selectedSort}
        onChange={item => handleSortChange(item.value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sortingWrapper: {
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});

export default SortingDropdown;
