import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout, LogoutUser } from '../../store/slices/authSlice';

export default function FacultyScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  React.useEffect(() => {
    if (!user) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Avatar.Text size={80} label={(user?.FullName || 'F').slice(0,1)} style={{marginBottom:12}} />
      <Text style={styles.title}>{user?.FullName || user?.UserName || 'Faculty'}</Text>
      <Text style={styles.info}>Email: {user?.Email || 'N/A'}</Text>
      <Text style={styles.info}>Mobile: {user?.MobileNo || 'N/A'}</Text>
      <Text style={styles.info}>Organization: {user?.OrganizationName || 'N/A'}</Text>
      <Text style={styles.info}>Institute: {user?.InstituteName || 'N/A'}</Text>

      <Button mode="contained" onPress={() => { dispatch(LogoutUser()); navigation.reset({index:0, routes:[{name:'Home'}]}); }} style={{marginTop:20}}>
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  info: { fontSize: 14, color: '#333', marginTop: 6 },
});
