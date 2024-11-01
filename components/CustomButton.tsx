import { TouchableOpacity, Text, GestureResponderEvent} from 'react-native';
import React from 'react'

type CustomButtonProps = {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerStyles?: string;
  textStyle?: string; 
  isLoading?: boolean;
};


const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  handlePress, 
  containerStyles = "", 
  textStyle = "", 
  isLoading = false 
}) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-[#ff9797] rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-SpaceMono text-lg ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton