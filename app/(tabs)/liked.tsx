import * as React from 'react';
import { Text } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import { Button } from '@react-navigation/elements';

export default function DrawerExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return <Text>Drawer content</Text>;
      }}
    >
      <Button
        onPress={() => setOpen((prevOpen) => !prevOpen)}
        className='mt-48'
      >
        {`${open ? 'Close' : 'Open'} drawer`}
      </Button>
    </Drawer>
  );
}