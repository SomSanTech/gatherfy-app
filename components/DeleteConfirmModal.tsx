import { Modal, Text, TouchableOpacity, View } from "react-native"

interface DeleteModalProps {
    isVisible: boolean
    onCancel: () => void
    onConfirm: () => void
  }

const DeleteConfirmModal: React.FC<DeleteModalProps> = ({ isVisible, onCancel, onConfirm }) => {
    return (
        <Modal visible={isVisible} transparent={true} animationType="fade" >
            <View className="flex-1 justify-end pb-5 items-center bg-black/50">
                <View className="p-5 items-center w-full">
                    <View className="bg-white p-4 rounded-2xl mb-2 w-full">
                        <TouchableOpacity onPress={onConfirm}>
                            <Text className="text-[#D71515] font-semibold text-center">Delete</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="bg-white p-4 rounded-2xl w-full">
                        <TouchableOpacity onPress={onCancel}>
                            <Text className="text-[#999999] font-semibold text-center">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteConfirmModal