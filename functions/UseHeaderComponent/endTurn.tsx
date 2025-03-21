import { saveDataAsync } from "../HomeScreen/saveDataAsync";
import { NavigationProp } from '@react-navigation/native';

export const endTurn: (navigation: NavigationProp<any>) => Promise<void> = async (navigation) => {
    saveDataAsync(); 
    navigation.navigate('Home');
};
