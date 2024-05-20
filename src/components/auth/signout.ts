import {signOut} from 'firebase/auth';
import {auth} from '../../lib/firebaseConfig'
import {useRouter} from 'next/navigation';


export const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/');
    }catch (error) {
      console.error("Error sign out: ", error);
    }
  };
  return {handleSignOut};
}