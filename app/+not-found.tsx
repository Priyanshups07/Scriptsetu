import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home screen after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/camera');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/(tabs)/camera" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
