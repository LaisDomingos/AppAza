import { saveDataAsync } from "../HomeScreen/saveDataAsync";
import { NavigationProp } from '@react-navigation/native';

export const endTurn: (navigation: NavigationProp<any>) => void = (navigation) => {
    saveDataAsync('remove', '', 0, '', ''); 
    navigation.navigate('Home');
    console.log("endTurn");
};
