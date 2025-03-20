import { saveDataAsync } from "../HomeScreen/saveDataAsync";
import { NavigationProp } from '@react-navigation/native';

export const endTurn: (navigation: NavigationProp<any>) => void = (navigation) => {
    saveDataAsync(); 
    navigation.navigate('Home');
};
