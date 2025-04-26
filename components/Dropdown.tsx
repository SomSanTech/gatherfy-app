import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as NavigationBar from "expo-navigation-bar";
interface SortingDropdownProps {
  sorting: (value: string) => void;
}

const SortingDropdown = ({ sorting }: SortingDropdownProps) => {
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    sorting(value); // Trigger sorting function
  };

  const handleClear = () => {
    setSelectedSort(null); // Clear the selected value
    sorting(""); // Pass an empty value to the sorting function
  };

  const sortingOptions = [
    { label: "Relevance", value: "" },
    { label: "Newest", value: "date_desc" },
    { label: "Oldest", value: "date_asc" },
    { label: "A-Z", value: "name_asc" },
    { label: "Z-A", value: "name_desc" },
  ];

  useEffect(() => {
    async function configureNavigationBar() {
      try {
        // ตั้งค่าพื้นหลังโปร่งใส
        await NavigationBar.setBackgroundColorAsync("#ffffffcc");
        // ตั้งค่าให้ปุ่มใน Navigation Bar เป็นสีอ่อน (หากพื้นหลังเป็นสีเข้ม)
        await NavigationBar.setButtonStyleAsync("dark");
        NavigationBar.setBorderColorAsync("#ffffff");
        setSelectedSort("")
      } catch (error) {
        console.error("Error configuring Navigation Bar:", error);
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
        activeColor="rgba(215, 21, 21, 0.5)"
        placeholderStyle={{
          color: "gray",
          fontSize: 16,
          lineHeight: 30,
          marginTop: 2,
          includeFontPadding: false,
        }} // เปลี่ยนฟอนต์ของ placeholder
        selectedTextStyle={{
          color: "black",
          marginTop: 2,
          includeFontPadding: false,
          paddingHorizontal: 4
        }}
        itemTextStyle={{
          color: "black",
          lineHeight: 17,
          marginTop: 2,
          includeFontPadding: false,
          fontSize: 16
        }}
        itemContainerStyle={{ backgroundColor: "white" }}
        value={selectedSort}
        fontFamily="Poppins-Regular"
        containerStyle={{ borderRadius: 10, maxHeight: 220, overflow: "hidden" }}
        onChange={(item) => handleSortChange(item.value)}
      />
    </View>
  );
};

interface DropdownProps {
  options: { label: string; value: string }[];
  defaultValue: string;
  indexFromParent: number;
  clearButton?: boolean;
  onSelect: (value: string) => void;
}

const DropdownComponent: React.FC<DropdownProps> = ({
  options,
  defaultValue,
  onSelect,
}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      data={options}
      labelField="label"
      valueField="value"
      placeholder="Select Platform"
      activeColor="rgba(215, 21, 21, 0.5)"
      placeholderStyle={{
        color: "gray",
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        lineHeight: 30,
        marginTop: 2,
        includeFontPadding: false,
      }} // เปลี่ยนฟอนต์ของ placeholder
      selectedTextStyle={{
        color: "black",
        fontFamily: "Poppins-Regular",
        includeFontPadding: false,
      }}
      itemTextStyle={{
        color: "black",
        fontFamily: "Poppins-Regular",
        lineHeight: 24,
        includeFontPadding: false,
      }}
      selectedTextProps={{ numberOfLines: 1 }}
      itemContainerStyle={{ backgroundColor: "white" }}
      value={defaultValue}
      onChange={(selectedItem) => onSelect(selectedItem.value)}
    />
  );
};

const styles = StyleSheet.create({
  sortingWrapper: {
    marginBottom: 0,
  },
  dropdown: {
    height: "120%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: "100%"
  },
});

export { SortingDropdown, DropdownComponent };
